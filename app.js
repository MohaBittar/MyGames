import { db } from "./firebase-config.js";
import {
  collection, onSnapshot, doc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { BUILTIN_GAMES } from "./builtin-games.js";

const grid = document.getElementById("grid");
const catsEl = document.getElementById("cats");
const searchEl = document.getElementById("search");
const countEl = document.getElementById("count");
const emptyEl = document.getElementById("empty");
const gridTitle = document.getElementById("gridTitle");

const player = document.getElementById("player");
const frame = document.getElementById("gameFrame");
const playerTitle = document.getElementById("playerTitle");
const loader = document.getElementById("loader");

let firestoreGames = [];
let activeCat = "All";
let term = "";
let current = null;

const PLAYS_KEY = "pz_plays";
const getPlays = () => JSON.parse(localStorage.getItem(PLAYS_KEY) || "{}");
const bumpPlays = (id) => {
  const p = getPlays();
  p[id] = (p[id] || 0) + 1;
  localStorage.setItem(PLAYS_KEY, JSON.stringify(p));
  return p[id];
};

const allGames = () => [...firestoreGames, ...BUILTIN_GAMES];

function toast(msg, type = "") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(t._h);
  t._h = setTimeout(() => (t.className = "toast"), 2600);
}

/* ---------- categories ---------- */
function renderCats() {
  const cats = ["All", ...new Set(allGames().map(g => g.category || "Other"))];
  catsEl.innerHTML = "";
  cats.forEach(c => {
    const b = document.createElement("button");
    b.className = "chip" + (c === activeCat ? " active" : "");
    b.textContent = c;
    b.onclick = () => { activeCat = c; renderCats(); render(); };
    catsEl.appendChild(b);
  });
}

/* ---------- grid ---------- */
function visibleGames() {
  return allGames().filter(g => {
    const okCat = activeCat === "All" || g.category === activeCat;
    const q = term.toLowerCase();
    const okTerm = !q || (g.title + " " + (g.description || "") + " " + (g.category || "")).toLowerCase().includes(q);
    return okCat && okTerm;
  });
}

function render() {
  const games = visibleGames();
  grid.innerHTML = "";
  emptyEl.classList.toggle("hidden", games.length > 0);
  countEl.textContent = games.length + " game" + (games.length === 1 ? "" : "s");
  gridTitle.textContent = activeCat === "All" ? "All Games" : activeCat + " Games";

  games.forEach(g => {
    const card = document.createElement("button");
    card.className = "game-card";
    const [c1, c2] = g.colors || ["#7c4dff", "#304ffe"];
    const local = getPlays()[g.id] || 0;
    card.innerHTML = `
      <div class="thumb" style="--c1:${c1};--c2:${c2}">
        ${g.thumb || "🎮"}
        ${g.builtin ? "" : '<span class="new-tag">NEW</span>'}
        <span class="plays">▶ ${(g.plays || 0) + local}</span>
      </div>
      <div class="card-body">
        <h3>${escapeHtml(g.title)}</h3>
        <p>${escapeHtml(g.description || "")}</p>
        <span class="tag">${escapeHtml(g.category || "Other")}</span>
      </div>`;
    card.onclick = () => openGame(g);
    grid.appendChild(card);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

/* ---------- player ---------- */
function openGame(g) {
  current = g;
  playerTitle.textContent = g.title;
  player.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  loader.style.display = "flex";

  if (g.file) {
    frame.removeAttribute("srcdoc");
    frame.src = g.file;
  } else {
    frame.src = "about:blank";
    frame.srcdoc = g.code || "<h2>Game code missing</h2>";
  }

  bumpPlays(g.id);
  countPlay(g);
  render();
}

function countPlay(g) {
  if (g.builtin) return;
  updateDoc(doc(db, "games", g.id), { plays: increment(1) }).catch(() => {});
}

function closeGame() {
  player.classList.add("hidden");
  document.body.style.overflow = "";
  frame.src = "about:blank";
  frame.removeAttribute("srcdoc");
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

frame.addEventListener("load", () => { loader.style.display = "none"; });
document.getElementById("backBtn").onclick = closeGame;
document.getElementById("reloadBtn").onclick = () => { if (current) openGame(current); };
document.getElementById("fsBtn").onclick = () => {
  const el = document.querySelector(".frame-wrap");
  if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => toast("Fullscreen blocked"));
  else document.exitFullscreen();
};
document.addEventListener("keydown", e => { if (e.key === "Escape" && !player.classList.contains("hidden")) closeGame(); });

/* ---------- hero ---------- */
function renderHero() {
  const games = allGames();
  const hero = games[0];
  if (!hero) return;
  document.getElementById("heroTitle").textContent = hero.title;
  document.getElementById("heroDesc").textContent = hero.description || "";
  document.getElementById("heroEmoji").textContent = hero.thumb || "🎮";
  document.getElementById("heroPlay").onclick = () => openGame(hero);
}

/* ---------- search ---------- */
searchEl.addEventListener("input", e => { term = e.target.value.trim(); render(); });

/* ---------- firebase stream ---------- */
renderCats();
renderHero();
render();

try {
  onSnapshot(collection(db, "games"),
    snap => {
      firestoreGames = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(g => g && g.title)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      renderCats();
      renderHero();
      render();
    },
    () => toast("Offline mode — showing built-in games", "err")
  );
} catch (e) {
  toast("Offline mode — showing built-in games", "err");
}
