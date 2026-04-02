/* =========================
   📲 APP MODE (PWA)
========================= */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

/* =========================
   🔊 SOUND
========================= */
const ambient = document.getElementById("ambient");
const whisper = document.getElementById("whisper");

document.body.addEventListener("click", () => {
  if (ambient) ambient.play().catch(()=>{});
});

/* =========================
   💡 LIGHT FOLLOW
========================= */
const glow = document.querySelector(".scripture-glow");

document.addEventListener("mousemove", e => {
  if (!glow) return;
  glow.style.setProperty("--x", e.clientX + "px");
  glow.style.setProperty("--y", e.clientY + "px");
});

/* =========================
   📚 CORE BOOKS
========================= */
const coreBooks = [
  "Vampire System",
  "Gods Eye",
  "My Dragonic System",
  "Dragon Inside of Me",
  "Shadow Blade",
  "Birth of a Demonic Sword",
  "Legendary Beast Tamer"
];

/* =========================
   🔥 NAME GENERATOR
========================= */
const words = ["Forbidden","Broken","Savage","Cursed","Immortal","Awakened"];
const hooks = ["System","King","Queen","Gate","Empire"];
const ends = ["of Shadows","of Blood","of Chaos","of Night"];
const genres = ["Dark Fantasy","Romantasy","LitRPG","Progression Fantasy"];

function generateBookName(){
  return `${words[Math.random()*words.length|0]} ${hooks[Math.random()*hooks.length|0]} ${ends[Math.random()*ends.length|0]} [${genres[Math.random()*genres.length|0]}]`;
}

/* =========================
   🎮 PLAYER
========================= */
let player = { level: 1, xp: 0 };
let currentBook = null;

/* =========================
   💾 SAVE
========================= */
function save(){
  localStorage.setItem("xavierOS_player", JSON.stringify(player));
}

function load(){
  const data = localStorage.getItem("xavierOS_player");
  if(data) player = JSON.parse(data);
}

/* =========================
   🧠 AI STORY SYSTEM
========================= */
const storyCache = {};
const styles = ["dark","epic","mystery","romance","brutal"];

function generateStory(title){

  if(storyCache[title]) return storyCache[title];

  const style = styles[Math.random()*styles.length|0];
  const pages = [];

  for(let i=1;i<=10;i++){

    let text = "";

    if(style==="dark") text = `Darkness consumed everything. ${title} awakened within you. Power demanded sacrifice.`;
    if(style==="epic") text = `The heavens trembled. ${title} marked your rise. Legends would be rewritten.`;
    if(style==="mystery") text = `Nothing made sense. ${title} appeared suddenly. Truth hid behind shadows.`;
    if(style==="romance") text = `Two souls collided. ${title} became more than power—it became destiny.`;
    if(style==="brutal") text = `Blood hit the ground. ${title} was survival. Only the ruthless endured.`;

    pages.push(`
      <h3>${title} — Chapter ${i}</h3>
      <p>${text}</p>
    `);
  }

  storyCache[title] = pages;
  return pages;
}

/* =========================
   🔊 AUDIOBOOK
========================= */
function speak(text){

  if(!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(
    text.replace(/<[^>]*>/g, '')
  );

  msg.rate = 0.9;
  msg.pitch = 1;

  window.speechSynthesis.speak(msg);
}

/* =========================
   📖 READER
========================= */
let currentPage = 0;
let currentPages = [];

function openReader(title){

  currentBook = title;
  currentPages = generateStory(title);

  currentPage = parseInt(localStorage.getItem("page_"+title)) || 0;

  document.getElementById("reader").style.display = "flex";

  renderPage();
}

function renderPage(){
  const content = currentPages[currentPage];
  document.getElementById("readerContent").innerHTML = content;
  speak(content);
}

function nextPage(){
  if(currentPage < currentPages.length - 1){
    currentPage++;
    localStorage.setItem("page_"+currentBook, currentPage);
    addXP();
    renderPage();
    save();
  }
}

function prevPage(){
  if(currentPage > 0){
    currentPage--;
    localStorage.setItem("page_"+currentBook, currentPage);
    renderPage();
  }
}

function closeReader(){
  document.getElementById("reader").style.display = "none";
}

/* =========================
   💎 RARITY
========================= */
function getRarity(){
  const r = Math.random();
  if(r < 0.6) return "common";
  if(r < 0.85) return "rare";
  if(r < 0.95) return "epic";
  if(r < 0.99) return "legendary";
  return "mythic";
}

function applyRarityStyle(el, rarity){

  if(rarity==="rare") el.style.boxShadow="0 0 15px cyan";
  if(rarity==="epic") el.style.boxShadow="0 0 20px purple";
  if(rarity==="legendary") el.style.boxShadow="0 0 25px gold,0 0 50px orange";
  if(rarity==="mythic"){
    el.style.boxShadow="0 0 30px red,0 0 60px gold";
    el.style.transform="scale(1.05)";
  }
}

/* =========================
   ✨ PARTICLES (ONLY WHEN ACTIVE)
========================= */
function spawnParticles(el){
  const c = el.querySelector(".particles");

  if(!c) return;

  const interval = setInterval(()=>{
    if(!el.classList.contains("active")) {
      clearInterval(interval);
      return;
    }

    const p = document.createElement("div");
    p.className="particle";
    p.style.left=Math.random()*100+"%";
    c.appendChild(p);

    setTimeout(()=>p.remove(),3000);
  },200);
}

/* =========================
   📖 CREATE BOOK (DEAD MODE)
========================= */
function createBook(name){

  const b = document.createElement("div");
  b.className = "book dead";

  const rarity = getRarity();
  b.dataset.rarity = rarity;
  b.dataset.name = name;

  b.innerHTML = `
    <div class="placeholder"></div>
    <div class="book-title">${name}</div>
  `;

  b.onclick = () => activateBook(b);

  return b;
}

/* =========================
   ⚡ ACTIVATE BOOK
========================= */
function activateBook(b){

  if(b.classList.contains("active")) return;

  const name = b.dataset.name;
  const rarity = b.dataset.rarity;

  b.classList.remove("dead");
  b.classList.add("active");

  applyRarityStyle(b, rarity);

  b.innerHTML = `
    <div class="book-inner">
      <div class="page">
        ${name}<br><small>${rarity.toUpperCase()}</small>
      </div>
      <div class="page back">📖</div>
    </div>
    <div class="particles"></div>
  `;

  spawnParticles(b);

  if(whisper) whisper.play().catch(()=>{});

  setTimeout(()=>{
    b.classList.toggle("open");
    openReader(name);
  }, 150);
}

/* =========================
   ⚡ XP
========================= */
function addXP(){

  if(!currentBook) return;

  player.xp += 10;

  if(player.xp >= player.level * 100){
    player.xp = 0;
    player.level++;
    spawnNewBook();
  }

  save();
  renderStats();
}

/* =========================
   📚 SPAWN
========================= */
function spawnNewBook(){

  let name;

  if(Math.random()<0.3){
    name = coreBooks[Math.random()*coreBooks.length|0];
  } else {
    name = generateBookName();
  }

  document.getElementById("rows").appendChild(createBook(name));
}

/* =========================
   🚀 INIT
========================= */
function initLibrary(){

  const rows = document.getElementById("rows");

  coreBooks.forEach(name=>{
    rows.appendChild(createBook(name));
  });

  for(let i=coreBooks.length;i<137;i++){
    rows.appendChild(createBook(generateBookName()));
  }
}

/* =========================
   🔄 LOOP
========================= */
setInterval(()=>{
  if(currentBook){
    addXP();
    if(Math.random()<0.3) spawnNewBook();
  }
},3000);

/* =========================
   📊 UI
========================= */
function renderStats(){

  let el = document.getElementById("stats");

  if(!el){
    el = document.createElement("div");
    el.id="stats";
    document.body.insertBefore(el, document.getElementById("rows"));
  }

  el.innerHTML = `
    🔥 Level: ${player.level} |
    ⚡ XP: ${player.xp} |
    📖 Reading: ${currentBook || "None"}
  `;
}

/* =========================
   🚀 START
========================= */
load();
initLibrary();
renderStats();
