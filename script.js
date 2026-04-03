/* =========================
   📲 PWA & CONFIG
========================= */
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

const AI_KEYS = {
  GEMINI: "AIzaSyB0I7AlW5MlEE73NvXgJ-G_d8Ie8h23okI",
  GROQ: "", OPENROUTER: "", HUGGINGFACE: ""
};

const GITHUB_TOKEN = "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";
const REPO_PATH = "faded201/Xavier-OS";

/* =========================
   🔊 SOUND & EFFECTS
========================= */
const ambient = document.getElementById("ambient");
const whisper = document.getElementById("whisper");

document.body.addEventListener("click", () => ambient?.play().catch(() => {}));

const glow = document.querySelector(".scripture-glow");
document.addEventListener("mousemove", e => {
  glow?.style.setProperty("--x", e.clientX + "px");
  glow?.style.setProperty("--y", e.clientY + "px");
});

/* =========================
   📚 CORE DATA
========================= */
const coreBooks = ["Vampire System", "Gods Eye", "My Dragonic System", "Dragon Inside of Me", "Shadow Blade", "Birth of a Demonic Sword", "Legendary Beast Tamer"];
let player = { level: 1, xp: 0 };
let currentBook = null;

/* =========================
   🧠 AI & STORAGE
========================= */
const storyCache = {};
function save() { localStorage.setItem("xavierOS_player", JSON.stringify(player)); }
function load() {
  const data = localStorage.getItem("xavierOS_player");
  if(data) player = JSON.parse(data);
}

async function geminiAI(title) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AI_KEYS.GEMINI}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: `You are Xavier. Write a cinematic dark fantasy story titled "${title}". Focus on deep world-building.` }] }] })
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

/* =========================
   🎨 THE LUXURY "DEAD" BOOK (Aetheria Style)
========================= */
function createBook(name) {
  const b = document.createElement("div");
  // We apply 'dead' initially to keep it dark/grayscale
  b.className = "book dead"; 
  b.dataset.name = name;

  // We use the Placeholder-Icon as the "Gold Oval Frame" from your screenshots
  b.innerHTML = `
    <div class="luxury-leather-overlay"></div>
    <div class="placeholder-icon">
       <span class="endless-tag">ENDLESS</span>
    </div>
    <div class="book-title">${name}</div>
    <div class="book-subtitle">System Chronicles</div>
    <div class="genre-tag">FANTASY</div>
  `;

  b.onclick = () => activateBook(b);
  return b;
}

/* =========================
   ⚡ AWAKENING THE ARCHIVE
========================= */
async function activateBook(b) {
  const name = b.dataset.name;

  if (b.classList.contains("active")) {
    openReader(name);
    return;
  }

  // 1. Trigger Sound & Visual Shift
  whisper?.play().catch(() => {});
  b.classList.remove("dead");
  b.classList.add("active");

  // 2. Build the Pollinations Image URL
  const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(name + " dark fantasy cinematic ornate book cover")}`;

  // 3. Inject the "Living" components
  // We keep the title/tags but inject the cover image into the oval frame
  b.innerHTML = `
    <div class="book-cover">
      <img src="${imgUrl}" onload="this.parentElement.classList.add('loaded')" />
    </div>
    <div class="luxury-leather-overlay"></div>
    <div class="gold-frame-active"></div>
    <div class="book-title">${name}</div>
    <div class="book-subtitle">System Chronicles</div>
    <div class="genre-tag">FANTASY</div>
    <div class="particles"></div>
  `;

  spawnParticles(b);

  // 4. Open the Reader after the "Awakening" animation
  setTimeout(() => openReader(name), 800);
}

/* =========================
   📖 READER & UI
========================= */
async function openReader(title) {
  currentBook = title;
  document.getElementById("reader").style.display = "flex";
  document.getElementById("readerContent").innerHTML = "<h3>Syncing with the Archive...</h3>";
  
  const text = await geminiAI(title);
  const pages = text.match(/.{1,400}/g);
  
  document.getElementById("readerContent").innerHTML = `<h3>${title}</h3><p>${pages[0]}</p>`;
  speak(pages[0]);
}

function spawnParticles(el) {
  const c = el.querySelector(".particles");
  setInterval(() => {
    if(!el.classList.contains("active")) return;
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.width = p.style.height = Math.random() * 3 + "px";
    c.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }, 200);
}

function initLibrary() {
  const rows = document.getElementById("rows");
  rows.innerHTML = "";
  coreBooks.forEach(name => rows.appendChild(createBook(name)));
  for(let i=0; i<15; i++) rows.appendChild(createBook(generateBookName()));
}

function renderStats() {
  const el = document.getElementById("stats") || document.createElement("div");
  el.id = "stats";
  if(!document.body.contains(el)) document.body.prepend(el);
  el.innerHTML = `🔥 LEVEL ${player.level} | ⚡ ${player.xp} XP | 📖 ${currentBook || "Idle"}`;
}

// Start
load();
initLibrary();
renderStats();
