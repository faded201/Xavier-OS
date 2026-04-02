// ==========================
// 🎮 PLAYER SYSTEM
// ==========================
let player = {
  level: 1,
  xp: 0,
  inventory: [],
  coins: 100
};

let market = [];
let pityCounter = 0;
let pityMax = 20;

let boss = {
  name: "Shadow Titan",
  hp: 100
};

// ==========================
// 💾 SAVE / LOAD
// ==========================
function savePlayer(){
  localStorage.setItem("player", JSON.stringify(player));
}

function loadPlayer(){
  const data = localStorage.getItem("player");
  if(data) player = JSON.parse(data);
}

loadPlayer();

// ==========================
// 🌈 RARITY MULTIPLIERS
// ==========================
const rarityMult = {
  common: 1,
  uncommon: 1.5,
  rare: 2,
  epic: 4,
  legendary: 8,
  mythical: 15
};

// ==========================
// 📚 AUDIOBOOK SERIES
// ==========================
const audiobookSeries = {
  "Quinn Vampire System": { currentXP: 0 },
  "Dragonic System": { currentXP: 0 },
  "Demonic Sword": { currentXP: 0 }
};

// ==========================
// ▶️ PLAYER CONTROL
// ==========================
let currentSeries = null;
let isPlaying = false;

function togglePlayPause(series) {
  if (currentSeries !== series) {
    currentSeries = series;
    isPlaying = true;
  } else {
    isPlaying = !isPlaying;
  }
}

// ==========================
// ⚡ XP SYSTEM
// ==========================
function getXPBoost(){
  let boost = 1;

  player.inventory.forEach(card => {
    if(card.name === "Blood Power") boost += 0.1 * card.level;
    if(card.name === "Dragon Flame") boost += 0.2 * card.level;
    if(card.name === "God Vision") boost += 0.5 * card.level;
  });

  return boost;
}

function addXP(amount){
  const boost = getXPBoost();

  player.xp += amount * boost;

  if(player.xp >= player.level * 50){
    player.xp = 0;
    player.level++;
    unlockReward();
  }

  savePlayer();
  renderAll();
}

// ==========================
// 🎯 PITY + CARD DROPS
// ==========================
function getRandomReward(){

  pityCounter++;

  // 🎯 pity trigger
  if(pityCounter >= pityMax){
    pityCounter = 0;

    return Math.random() < 0.2
      ? {name:"Blood Evolution Core", rarity:"mythical"}
      : {name:"God Vision", rarity:"legendary"};
  }

  const roll = Math.random();

  if (roll < 0.4) return {name:"Basic Strength", rarity:"common"};
  if (roll < 0.65) return {name:"Sharp Instinct", rarity:"uncommon"};
  if (roll < 0.85) return {name:"Dragon Flame", rarity:"rare"};
  if (roll < 0.95) return {name:"Shadow Step", rarity:"epic"};
  if (roll < 0.995) return {name:"God Vision", rarity:"legendary"};
  return {name:"Blood Evolution Core", rarity:"mythical"};
}

// ==========================
// 💥 FX (optional hook)
// ==========================
function flashEffect(){
  const f = document.getElementById("flash");
  if(!f) return;

  f.style.opacity = 1;
  setTimeout(()=>f.style.opacity = 0, 200);
}

// ==========================
// 🎁 PACK OPEN
// ==========================
function unlockReward(){

  const reward = getRandomReward();

  flashEffect();

  let existing = player.inventory.find(c => c.name === reward.name);

  if(existing){
    existing.level++;
  } else {
    player.inventory.push({
      name: reward.name,
      rarity: reward.rarity,
      level: 1,
      id: Date.now() + Math.random()
    });
  }

  savePlayer();
  renderAll();
}

// ==========================
// 🎰 10x PACK
// ==========================
function openMultiPack(){

  let results = [];

  for(let i=0;i<10;i++){
    const reward = getRandomReward();

    results.push(reward.rarity);

    player.inventory.push({
      ...reward,
      level:1,
      id:Date.now()+Math.random()
    });
  }

  alert("🎰 10x Pack:\n" + results.join(", "));

  savePlayer();
  renderAll();
}

// ==========================
// 🧬 FUSION SYSTEM
// ==========================
function checkFusion(){

  const hasDragon = player.inventory.find(c => c.name === "Dragon Flame");
  const hasBlood = player.inventory.find(c => c.name === "Basic Strength");

  if(hasDragon && hasBlood){

    const exists = player.inventory.find(c => c.name === "Dragon Blood Core");

    if(!exists){
      player.inventory.push({
        name: "Dragon Blood Core",
        rarity: "mythical",
        level: 1,
        id: Date.now()
      });
    }
  }

  savePlayer();
  renderAll();
}

// ==========================
// 💪 PLAYER POWER
// ==========================
function getPlayerPower(){

  let power = player.level;

  player.inventory.forEach(card => {
    power += card.level * 2;
  });

  return power;
}

// ==========================
// 👹 BOSS SYSTEM
// ==========================
function attackBoss(){

  let damage = getPlayerPower();
  boss.hp -= damage;

  if(boss.hp <= 0){
    alert("🏆 Boss Defeated!");

    for(let i=0;i<3;i++) unlockReward();

    boss.hp = 150 + player.level * 20;
  } else {
    alert("⚔️ " + damage + " damage!");
  }

  renderAll();
}

// ==========================
// 💰 CARD VALUE
// ==========================
function getCardValue(card){
  return Math.floor(
    10 * rarityMult[card.rarity] * card.level * (getPlayerPower() / 10)
  );
}

// ==========================
// 🛒 MARKET
// ==========================
function listCard(cardId){

  const card = player.inventory.find(c => c.id === cardId);
  if(!card) return;

  const price = getCardValue(card);

  market.push({...card, price});
  player.inventory = player.inventory.filter(c => c.id !== cardId);

  savePlayer();
  renderAll();
}

function buyCard(cardId){

  const item = market.find(c => c.id === cardId);
  if(!item) return;

  if(player.coins >= item.price){
    player.coins -= item.price;
    player.inventory.push(item);
    market = market.filter(c => c.id !== cardId);
  } else {
    alert("❌ Not enough coins");
  }

  savePlayer();
  renderAll();
}

// ==========================
// 🎨 RENDER EVERYTHING
// ==========================
function renderAll(){

  const stats = document.getElementById("playerStats");
  if(stats){
    stats.innerHTML = `
      🔥 Level: ${player.level} <br>
      ⚡ Power: ${getPlayerPower()} <br>
      💰 Coins: ${player.coins} <br>
      🃏 Cards: ${player.inventory.length}
    `;
  }

  const bossEl = document.getElementById("bossHP");
  if(bossEl){
    bossEl.innerText = `👹 ${boss.name} HP: ${boss.hp}`;
  }

  const container = document.getElementById("cardCollection");
  if(container){
    container.innerHTML = "";

    player.inventory.forEach(card => {

      const div = document.createElement("div");
      div.className = "card-item " + card.rarity;

      div.innerHTML = `
        <h4>${card.name}</h4>
        <p>${card.rarity.toUpperCase()}</p>
        <p>Lv.${card.level}</p>
        <p>⚡ ${getCardValue(card)}</p>
        <button onclick="listCard(${card.id})">Sell</button>
      `;

      container.appendChild(div);
    });
  }

  const marketEl = document.getElementById("market");
  if(marketEl){
    marketEl.innerHTML = "";

    market.forEach(card => {

      const div = document.createElement("div");
      div.className = "card-item " + card.rarity;

      div.innerHTML = `
        <h4>${card.name}</h4>
        <p>${card.rarity}</p>
        <p>💰 ${card.price}</p>
        <button onclick="buyCard(${card.id})">Buy</button>
      `;

      marketEl.appendChild(div);
    });
  }
}

// ==========================
// 🔄 AUTO XP LOOP
// ==========================
setInterval(() => {
  if(isPlaying && currentSeries){
    audiobookSeries[currentSeries].currentXP += 10;

    addXP(10);

    if(Math.random() < 0.3){
      unlockReward();
    }

    checkFusion();
  }
}, 5000);

// ==========================
// 🚀 INIT
// ==========================
renderAll();
