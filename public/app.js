// ==========================
// 🎮 PLAYER SYSTEM
// ==========================
let player = {
  level: 1,
  xp: 0,
  inventory: [],
  coins: 100
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
    console.log(`🎧 Playing: ${series}`);
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

    console.log("🔥 LEVEL UP!");

    unlockReward();
  }

  savePlayer();
  renderAll();
}

// ==========================
// 🎲 CARD DROPS
// ==========================
function getRandomReward(){

  const roll = Math.random();

  if (roll < 0.4) return {name:"Basic Strength", rarity:"common"};
  if (roll < 0.65) return {name:"Sharp Instinct", rarity:"uncommon"};
  if (roll < 0.85) return {name:"Dragon Flame", rarity:"rare"};
  if (roll < 0.95) return {name:"Shadow Step", rarity:"epic"};
  if (roll < 0.995) return {name:"God Vision", rarity:"legendary"};
  return {name:"Blood Evolution Core", rarity:"mythical"};
}

function unlockReward(){

  const reward = getRandomReward();

  let existing = player.inventory.find(c => c.name === reward.name);

  if(existing){
    existing.level++;
  } else {
    const card = {
      name: reward.name,
      rarity: reward.rarity,
      level: 1,
      id: Date.now()
    };

    player.inventory.push(card);
  }

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

      console.log("🧬 MYTHICAL FUSION!");
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
let market = [];

function listCard(cardId){

  const card = player.inventory.find(c => c.id === cardId);
  const price = getCardValue(card);

  market.push({...card, price});

  player.inventory = player.inventory.filter(c => c.id !== cardId);

  savePlayer();
  renderAll();
}

function buyCard(cardId){

  const item = market.find(c => c.id === cardId);

  if(player.coins >= item.price){

    player.coins -= item.price;
    player.inventory.push(item);

    market = market.filter(c => c.id !== cardId);

    console.log("🛒 Purchased:", item.name);

  } else {
    console.log("❌ Not enough coins");
  }

  savePlayer();
  renderAll();
}

// ==========================
// 🎨 RENDER EVERYTHING
// ==========================
function renderAll(){

  // PLAYER STATS
  const stats = document.getElementById("playerStats");
  if(stats){
    stats.innerHTML = `
      🔥 Level: ${player.level} <br>
      ⚡ Power: ${getPlayerPower()} <br>
      💰 Coins: ${player.coins} <br>
      🃏 Cards: ${player.inventory.length}
    `;
  }

  // INVENTORY
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

  // MARKET
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

// INITIAL RENDER
renderAll();
