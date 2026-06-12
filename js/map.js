/* The Map of Roads: a visualizer of every way the tale can be played.

   Part A (DOM-free, validated by selftest.js): extracts a node/edge graph
   from the scene data and computes a layered left-to-right layout.
   Part B (browser): renders the graph as SVG in a full-screen overlay with
   pan/zoom, remembers exploration across playthroughs in localStorage, and
   highlights the route of the just-finished run. Unvisited scenes keep
   their shape but not their name ("???"), so the map fills in over replays. */
(function (HC) {
  "use strict";

  // -------------------------------------------------- Part A: graph model

  /* The three function-valued gotos in the story and the targets they can
     resolve to. Keyed "<sceneId>#<choiceIndex>". selftest.js asserts this
     table matches the story exactly, so edits there can't silently drift. */
  const DYN_TARGETS = {
    "barrow_throne#1": ["aldous_lie_lantern", "aldous_lie"],
    "road_wound#4": ["vex_ambush", "monastery_gate"],
    "final_choice#1": ["end_new_shepherd", "end_tyrant", "end_uneasy_god"],
  };

  function buildGraph(scenes) {
    const nodes = {};
    const edges = [];
    const seen = new Set();
    const missingDyn = [];

    function addEdge(from, to, kind) {
      if (typeof to !== "string") return;
      const key = `${from}>${to}>${kind}`;
      if (seen.has(key)) return;
      seen.add(key);
      edges.push({ from, to, kind, self: from === to });
    }

    for (const id of Object.keys(scenes)) {
      const scene = scenes[id];
      nodes[id] = {
        id,
        ending: typeof scene.ending === "string" ? scene.ending : null,
      };
      (scene.choices || []).forEach((ch, i) => {
        if ("goto" in ch) {
          if (typeof ch.goto === "function") {
            const dyn = DYN_TARGETS[`${id}#${i}`];
            if (!dyn) missingDyn.push(`${id}#${i} (goto)`);
            else for (const t of dyn) addEdge(id, t, "fate");
          } else {
            addEdge(id, ch.goto, "choice");
          }
        }
        if (ch.check) {
          if (typeof ch.check.ok === "function") missingDyn.push(`${id}#${i} (check.ok)`);
          if (typeof ch.check.fail === "function") missingDyn.push(`${id}#${i} (check.fail)`);
          addEdge(id, ch.check.ok, "check-ok");
          addEdge(id, ch.check.fail, "check-fail");
        }
        if (ch.combat) {
          if (typeof ch.combat.win === "function") missingDyn.push(`${id}#${i} (combat.win)`);
          if (typeof ch.combat.flee === "function") missingDyn.push(`${id}#${i} (combat.flee)`);
          addEdge(id, ch.combat.win, "combat");
          addEdge(id, ch.combat.flee, "flee");
          addEdge(id, "death", "combat");
        }
      });
    }
    return { nodes, edges, missingDyn };
  }

  /* Layered layout. Layer = BFS shortest distance from "intro" (cycle-safe);
     every ending scene is forced into one shared final column. Within each
     column, a few barycenter sweeps reduce edge crossings. Returns center
     positions plus the graph bounds. */
  const COL_W = 230;
  const ROW_H = 48;

  function layout(graph) {
    const ids = Object.keys(graph.nodes);
    const out = {}; // id -> [targets]
    const inc = {}; // id -> [sources]
    for (const id of ids) { out[id] = []; inc[id] = []; }
    for (const e of graph.edges) {
      if (e.self) continue;
      if (out[e.from] && inc[e.to]) {
        out[e.from].push(e.to);
        inc[e.to].push(e.from);
      }
    }

    // BFS layers from intro
    const layerOf = {};
    if (graph.nodes.intro) {
      layerOf.intro = 0;
      const queue = ["intro"];
      while (queue.length) {
        const id = queue.shift();
        for (const t of out[id]) {
          if (!(t in layerOf)) {
            layerOf[t] = layerOf[id] + 1;
            queue.push(t);
          }
        }
      }
    }
    let maxMid = 0;
    for (const id of ids) {
      if (!graph.nodes[id].ending && id in layerOf) {
        maxMid = Math.max(maxMid, layerOf[id]);
      }
    }
    const finalLayer = maxMid + 1;
    for (const id of ids) {
      if (graph.nodes[id].ending) layerOf[id] = finalLayer;
      else if (!(id in layerOf)) layerOf[id] = maxMid; // unreachable guard
    }

    // columns, deterministic initial order
    const cols = [];
    for (let l = 0; l <= finalLayer; l++) cols.push([]);
    for (const id of ids.slice().sort()) cols[layerOf[id]].push(id);

    const idx = {}; // id -> centered position within its column
    const recenter = () => {
      for (const col of cols) {
        col.forEach((id, i) => { idx[id] = i - (col.length - 1) / 2; });
      }
    };
    recenter();

    const sweep = (useIncoming) => {
      const order = useIncoming
        ? cols.map((_, i) => i)
        : cols.map((_, i) => cols.length - 1 - i);
      for (const l of order) {
        const col = cols[l];
        const score = {};
        for (const id of col) {
          const nbrs = useIncoming ? inc[id] : out[id];
          score[id] = nbrs.length
            ? nbrs.reduce((s, n) => s + idx[n], 0) / nbrs.length
            : idx[id];
        }
        col.sort((a, b) => score[a] - score[b] || a.localeCompare(b));
        col.forEach((id, i) => { idx[id] = i - (col.length - 1) / 2; });
      }
    };
    sweep(true); sweep(false); sweep(true);

    const pos = {};
    let minY = 0, maxY = 0;
    for (const id of ids) {
      pos[id] = { x: layerOf[id] * COL_W, y: idx[id] * ROW_H };
      minY = Math.min(minY, pos[id].y);
      maxY = Math.max(maxY, pos[id].y);
    }
    return { pos, layerOf, width: finalLayer * COL_W, minY, maxY };
  }

  // ------------------------------------------- exploration memory (browser)
  const MEM_KEY = "hollow_crown_map_v1";
  let memCache = null;

  function mem() {
    if (memCache) return memCache;
    let m = null;
    try { m = JSON.parse(localStorage.getItem(MEM_KEY)); } catch (e) { /* ignore */ }
    if (!m || typeof m !== "object") m = {};
    m.scenes = m.scenes || {};
    m.edges = m.edges || {};
    m.endings = m.endings || {};
    memCache = m;
    return m;
  }

  function persistMem() {
    try { localStorage.setItem(MEM_KEY, JSON.stringify(mem())); } catch (e) { /* ignore */ }
  }

  function recordVisit(id) {
    if (!mem().scenes[id]) { mem().scenes[id] = 1; persistMem(); }
  }
  function recordEdge(from, to) {
    const key = `${from}>${to}`;
    if (!mem().edges[key]) { mem().edges[key] = 1; persistMem(); }
  }
  function recordEnding(title) {
    if (!mem().endings[title]) { mem().endings[title] = 1; persistMem(); }
  }
  function hasEndingRecorded() {
    return Object.keys(mem().endings).length > 0;
  }

  // ------------------------------------------------- Part B: SVG rendering
  const SVG_NS = "http://www.w3.org/2000/svg";

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function svg(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function humanize(id) {
    return id.split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  function nodeLabel(node, visited) {
    if (!visited) return "???";
    if (node.ending) return node.ending;
    return humanize(node.id);
  }

  function open(opts) {
    opts = opts || {};
    if (document.getElementById("map-overlay")) return;
    const scenes = HC.presenter.getScenes();
    const graph = buildGraph(scenes);
    const lay = layout(graph);
    const m = mem();

    const path = opts.path || [];
    const pathSet = new Set(path);
    const pathEdges = new Set();
    for (let i = 1; i < path.length; i++) {
      pathEdges.add(`${path[i - 1]}>${path[i]}`);
    }
    const isVisited = (id) => !!m.scenes[id] || pathSet.has(id);
    const isWalkedEdge = (e) => pathEdges.has(`${e.from}>${e.to}`);
    const isSeenEdge = (e) => !!m.edges[`${e.from}>${e.to}`] || isWalkedEdge(e);

    // ---- overlay scaffolding
    const overlay = el("div");
    overlay.id = "map-overlay";
    const bar = el("div", "map-bar");
    bar.appendChild(el("h2", "map-title", "THE MAP OF ROADS"));
    const seenCount = Object.keys(scenes).filter(isVisited).length;
    bar.appendChild(el("div", "map-count",
      `${seenCount} of ${Object.keys(scenes).length} places walked · ` +
      `${Object.keys(m.endings).length} of ` +
      `${Object.values(graph.nodes).filter((n) => n.ending).length} endings found`));
    const legend = el("div", "map-legend");
    for (const [cls, label] of [["lg-walked", "this road"], ["lg-seen", "walked before"],
                                ["lg-unknown", "unknown"], ["lg-check", "fate's dice"],
                                ["lg-combat", "battle"], ["lg-ending", "ending"]]) {
      const item = el("span", "legend-item");
      item.appendChild(el("span", `legend-swatch ${cls}`));
      item.append(label);
      legend.appendChild(item);
    }
    bar.appendChild(legend);
    const controls = el("div", "map-controls");
    const zoomIn = el("button", "map-btn", "+");
    const zoomOut = el("button", "map-btn", "−");
    const reset = el("button", "map-btn", "Reset");
    const closeBtn = el("button", "map-btn map-close", "Close");
    controls.append(zoomIn, zoomOut, reset, closeBtn);
    bar.appendChild(controls);
    overlay.appendChild(bar);

    const canvas = el("div", "map-canvas");
    overlay.appendChild(canvas);
    const svgRoot = svg("svg", { width: "100%", height: "100%" });
    const root = svg("g", {});
    svgRoot.appendChild(root);
    canvas.appendChild(svgRoot);
    document.body.appendChild(overlay);

    // ---- geometry helpers
    const boxW = {};
    for (const id of Object.keys(graph.nodes)) {
      const label = nodeLabel(graph.nodes[id], isVisited(id));
      boxW[id] = Math.max(44, label.length * 6.6 + 18);
    }
    const boxH = 24;

    // ---- edges
    const edgeLayer = svg("g", {});
    root.appendChild(edgeLayer);
    for (const e of graph.edges) {
      if (e.self) continue;
      const a = lay.pos[e.from], b = lay.pos[e.to];
      if (!a || !b) continue;
      const sx = a.x + boxW[e.from] / 2, sy = a.y;
      const tx = b.x - boxW[e.to] / 2, ty = b.y;
      const back = lay.layerOf[e.to] <= lay.layerOf[e.from];
      let d;
      if (back) {
        const drop = 36 + Math.abs(sy - ty) * 0.08;
        d = `M ${sx} ${sy} C ${sx + 70} ${sy + drop}, ${tx - 70} ${ty + drop}, ${tx} ${ty}`;
      } else {
        const mx = (tx - sx) * 0.45;
        d = `M ${sx} ${sy} C ${sx + mx} ${sy}, ${tx - mx} ${ty}, ${tx} ${ty}`;
      }
      let cls = `map-edge kind-${e.kind}`;
      if (back) cls += " back";
      if (isWalkedEdge(e)) cls += " walked";
      else if (!isSeenEdge(e)) cls += " unseen";
      edgeLayer.appendChild(svg("path", { d, class: cls, fill: "none" }));
    }

    // ---- nodes
    const nodeLayer = svg("g", {});
    root.appendChild(nodeLayer);
    for (const id of Object.keys(graph.nodes)) {
      const node = graph.nodes[id];
      const p = lay.pos[id];
      const visited = isVisited(id);
      let cls = "map-node";
      if (!visited) cls += " unvisited";
      if (node.ending) cls += " ending";
      if (id === "death") cls += " death";
      if (pathSet.has(id)) cls += " walked";
      const g = svg("g", { class: cls, transform: `translate(${p.x}, ${p.y})` });
      g.appendChild(svg("rect", {
        x: -boxW[id] / 2, y: -boxH / 2, width: boxW[id], height: boxH,
        rx: node.ending ? 12 : 5,
      }));
      const text = svg("text", { x: 0, y: 4, "text-anchor": "middle" });
      text.textContent = nodeLabel(node, visited);
      g.appendChild(text);
      if (visited) {
        const title = svg("title", {});
        title.textContent = node.ending ? `Ending: ${node.ending}` : humanize(id);
        g.appendChild(title);
      }
      nodeLayer.appendChild(g);
    }

    // ---- pan & zoom
    const view = { x: 0, y: 0, k: 1 };
    function apply() {
      root.setAttribute("transform",
        `translate(${view.x}, ${view.y}) scale(${view.k})`);
    }
    function resetView() {
      const rect = canvas.getBoundingClientRect();
      const graphH = (lay.maxY - lay.minY) + ROW_H * 2;
      view.k = Math.min(1, Math.max(0.3, (rect.height - 40) / graphH));
      const start = lay.pos.intro || { x: 0, y: 0 };
      view.x = 70 - (start.x - boxW.intro / 2) * view.k;
      view.y = rect.height / 2 - start.y * view.k;
      apply();
    }
    function zoomAt(px, py, factor) {
      const k2 = Math.min(2.5, Math.max(0.15, view.k * factor));
      view.x = px - (px - view.x) * (k2 / view.k);
      view.y = py - (py - view.y) * (k2 / view.k);
      view.k = k2;
      apply();
    }
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top,
        Math.exp(-e.deltaY * 0.0012));
    }, { passive: false });
    let drag = null;
    canvas.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("dragging");
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!drag) return;
      view.x += e.clientX - drag.x;
      view.y += e.clientY - drag.y;
      drag = { x: e.clientX, y: e.clientY };
      apply();
    });
    canvas.addEventListener("pointerup", () => {
      drag = null;
      canvas.classList.remove("dragging");
    });
    const zoomCenter = (factor) => {
      const rect = canvas.getBoundingClientRect();
      zoomAt(rect.width / 2, rect.height / 2, factor);
    };
    zoomIn.addEventListener("click", () => zoomCenter(1.3));
    zoomOut.addEventListener("click", () => zoomCenter(1 / 1.3));
    reset.addEventListener("click", resetView);

    // ---- close
    function close() {
      document.removeEventListener("keydown", onKey);
      overlay.remove();
    }
    function onKey(e) {
      if (e.code === "Escape") { e.stopPropagation(); close(); }
    }
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", onKey);

    resetView();
    return { close };
  }

  HC.map = {
    DYN_TARGETS, buildGraph, layout,
    recordVisit, recordEdge, recordEnding, hasEndingRecorded,
    open,
  };
})(globalThis.HC);
