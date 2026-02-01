/* Bird Card Blackjack - Game Logic */

// Game State
const gameState = {
  bankroll: 500,
  currentBet: 25,
  deck: [],
  playerHand: [],
  dealerHand: [],
  phase: 'betting', // betting | playerTurn | dealerTurn | resolution
  result: null      // null | 'win' | 'lose' | 'push' | 'blackjack'
};

// DOM Elements
const elements = {
  dealerHand: document.getElementById('dealer-hand'),
  playerHand: document.getElementById('player-hand'),
  dealerValue: document.getElementById('dealer-value'),
  playerValue: document.getElementById('player-value'),
  bankroll: document.getElementById('bankroll'),
  resultMessage: document.getElementById('result-message'),
  btnHit: document.getElementById('btn-hit'),
  btnStand: document.getElementById('btn-stand'),
  btnDouble: document.getElementById('btn-double'),
  btnDeal: document.getElementById('btn-deal'),
  btnRestart: document.getElementById('btn-restart'),
  actionButtons: document.getElementById('action-buttons')
};

// Card Suits and Ranks
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Initialize Game
function init() {
  loadBankroll();
  updateBankrollDisplay();
  setupEventListeners();
  checkBroke();
}

// Session Storage
function saveBankroll() {
  sessionStorage.setItem('birdBlackjackBankroll', gameState.bankroll);
}

function loadBankroll() {
  const saved = sessionStorage.getItem('birdBlackjackBankroll');
  if (saved !== null) {
    gameState.bankroll = parseInt(saved, 10);
  }
}

// Create and Shuffle Deck
function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Card Value Calculation
function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  if (card.rank === 'A') return 11; // Handled separately for soft totals
  return parseInt(card.rank, 10);
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    value += getCardValue(card);
    if (card.rank === 'A') aces++;
  }

  // Adjust for aces if over 21
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function isBlackjack(hand) {
  return hand.length === 2 && calculateHandValue(hand) === 21;
}

function isBusted(hand) {
  return calculateHandValue(hand) > 21;
}

// Card DOM Creation
function createCardElement(card, faceDown = false) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  if (faceDown) cardDiv.classList.add('flipped');

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  // Card Face
  const face = document.createElement('div');
  face.className = 'card-face';
  const faceImg = document.createElement('img');
  faceImg.src = `assets/cards/${card.suit}_${card.rank}.png`;
  faceImg.alt = `${card.rank} of ${card.suit}`;
  face.appendChild(faceImg);

  // Card Back
  const back = document.createElement('div');
  back.className = 'card-back';
  const backImg = document.createElement('img');
  backImg.src = 'assets/cards/back.png';
  backImg.alt = 'Card back';
  back.appendChild(backImg);

  inner.appendChild(face);
  inner.appendChild(back);
  cardDiv.appendChild(inner);

  return cardDiv;
}

// Dealing Animation
function dealCard(container, card, faceDown = false, delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      const cardEl = createCardElement(card, faceDown);
      cardEl.classList.add('dealing');
      container.appendChild(cardEl);

      cardEl.addEventListener('animationend', () => {
        cardEl.classList.remove('dealing');
        resolve(cardEl);
      }, { once: true });
    }, delay);
  });
}

function hitCard(container, card, delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      const cardEl = createCardElement(card, false);
      cardEl.classList.add('hitting');
      container.appendChild(cardEl);

      cardEl.addEventListener('animationend', () => {
        cardEl.classList.remove('hitting');
        resolve(cardEl);
      }, { once: true });
    }, delay);
  });
}

// Update Displays
function updateHandValues() {
  const playerValue = calculateHandValue(gameState.playerHand);
  elements.playerValue.textContent = playerValue;

  // Only show dealer's visible card value during player turn
  if (gameState.phase === 'playerTurn') {
    const visibleCard = gameState.dealerHand[0];
    elements.dealerValue.textContent = getCardValue(visibleCard);
  } else if (gameState.phase === 'resolution' || gameState.phase === 'dealerTurn') {
    elements.dealerValue.textContent = calculateHandValue(gameState.dealerHand);
  } else {
    elements.dealerValue.textContent = '';
  }
}

function updateBankrollDisplay(animate = null) {
  elements.bankroll.textContent = `$${gameState.bankroll}`;

  if (animate === 'win') {
    elements.bankroll.classList.remove('losing');
    elements.bankroll.classList.add('winning');
    setTimeout(() => elements.bankroll.classList.remove('winning'), 500);
  } else if (animate === 'lose') {
    elements.bankroll.classList.remove('winning');
    elements.bankroll.classList.add('losing');
    setTimeout(() => elements.bankroll.classList.remove('losing'), 500);
  }
}

function showResult(message, type) {
  elements.resultMessage.textContent = message;
  elements.resultMessage.className = 'result-message show ' + type;
}

function hideResult() {
  elements.resultMessage.className = 'result-message';
}

// Button States
function setButtonsEnabled(hit, stand, double) {
  elements.btnHit.disabled = !hit;
  elements.btnStand.disabled = !stand;
  elements.btnDouble.disabled = !double;
}

function showDealButton() {
  elements.btnDeal.style.display = 'block';
  elements.btnDeal.disabled = false;
}

function hideDealButton() {
  elements.btnDeal.style.display = 'none';
}

function checkBroke() {
  if (gameState.bankroll < gameState.currentBet) {
    elements.btnDeal.style.display = 'none';
    elements.btnRestart.style.display = 'block';
    setButtonsEnabled(false, false, false);
    showResult('Broke!', 'lose');
    return true;
  }
  elements.btnRestart.style.display = 'none';
  return false;
}

// Game Actions
async function deal() {
  if (gameState.bankroll < gameState.currentBet) return;

  // Reset state
  gameState.deck = shuffleDeck(createDeck());
  gameState.playerHand = [];
  gameState.dealerHand = [];
  gameState.result = null;
  gameState.phase = 'dealing';

  // Clear UI
  elements.dealerHand.innerHTML = '';
  elements.playerHand.innerHTML = '';
  elements.dealerValue.textContent = '';
  elements.playerValue.textContent = '';
  hideResult();
  elements.dealerHand.classList.remove('winner', 'loser');
  elements.playerHand.classList.remove('winner', 'loser');

  // Deduct bet
  gameState.bankroll -= gameState.currentBet;
  saveBankroll();
  updateBankrollDisplay();

  // Hide deal button
  hideDealButton();
  setButtonsEnabled(false, false, false);

  // Deal cards with animation
  const card1 = gameState.deck.pop();
  const card2 = gameState.deck.pop();
  const card3 = gameState.deck.pop();
  const card4 = gameState.deck.pop();

  gameState.playerHand.push(card1);
  await dealCard(elements.playerHand, card1, false, 0);

  gameState.dealerHand.push(card2);
  await dealCard(elements.dealerHand, card2, false, 150);

  gameState.playerHand.push(card3);
  await dealCard(elements.playerHand, card3, false, 150);

  gameState.dealerHand.push(card4);
  await dealCard(elements.dealerHand, card4, true, 150); // Face down

  updateHandValues();

  // Check for blackjack
  if (isBlackjack(gameState.playerHand)) {
    await revealDealerHoleCard();
    if (isBlackjack(gameState.dealerHand)) {
      // Push
      endGame('push');
    } else {
      // Player blackjack wins 3:2
      endGame('blackjack');
    }
    return;
  }

  // Player's turn
  gameState.phase = 'playerTurn';
  const canDouble = gameState.bankroll >= gameState.currentBet;
  setButtonsEnabled(true, true, canDouble);
}

async function hit() {
  if (gameState.phase !== 'playerTurn') return;

  setButtonsEnabled(false, false, false);

  const card = gameState.deck.pop();
  gameState.playerHand.push(card);
  await hitCard(elements.playerHand, card);
  updateHandValues();

  if (isBusted(gameState.playerHand)) {
    await revealDealerHoleCard();
    endGame('lose');
    return;
  }

  // Can't double after hitting
  setButtonsEnabled(true, true, false);
}

async function stand() {
  if (gameState.phase !== 'playerTurn') return;

  setButtonsEnabled(false, false, false);
  gameState.phase = 'dealerTurn';

  await revealDealerHoleCard();
  await dealerPlay();
  determineWinner();
}

async function doubleDown() {
  if (gameState.phase !== 'playerTurn') return;
  if (gameState.bankroll < gameState.currentBet) return;

  setButtonsEnabled(false, false, false);

  // Double the bet
  gameState.bankroll -= gameState.currentBet;
  gameState.currentBet *= 2;
  saveBankroll();
  updateBankrollDisplay();

  // Draw exactly one card
  const card = gameState.deck.pop();
  gameState.playerHand.push(card);
  await hitCard(elements.playerHand, card);
  updateHandValues();

  if (isBusted(gameState.playerHand)) {
    await revealDealerHoleCard();
    endGame('lose');
    // Reset bet
    gameState.currentBet = 25;
    return;
  }

  // Proceed to dealer
  gameState.phase = 'dealerTurn';
  await revealDealerHoleCard();
  await dealerPlay();
  determineWinner();

  // Reset bet
  gameState.currentBet = 25;
}

async function revealDealerHoleCard() {
  const holeCard = elements.dealerHand.querySelector('.card.flipped');
  if (holeCard) {
    holeCard.classList.remove('flipped');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  updateHandValues();
}

async function dealerPlay() {
  // Dealer hits on 16 or less, stands on 17+
  while (calculateHandValue(gameState.dealerHand) < 17) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const card = gameState.deck.pop();
    gameState.dealerHand.push(card);
    await hitCard(elements.dealerHand, card);
    updateHandValues();
  }
}

function determineWinner() {
  const playerValue = calculateHandValue(gameState.playerHand);
  const dealerValue = calculateHandValue(gameState.dealerHand);

  if (isBusted(gameState.dealerHand)) {
    endGame('win');
  } else if (playerValue > dealerValue) {
    endGame('win');
  } else if (playerValue < dealerValue) {
    endGame('lose');
  } else {
    endGame('push');
  }
}

function endGame(result) {
  gameState.phase = 'resolution';
  gameState.result = result;

  let message = '';
  let winnings = 0;

  switch (result) {
    case 'blackjack':
      message = 'Blackjack!';
      winnings = gameState.currentBet + Math.floor(gameState.currentBet * 2.5); // Original + 3:2
      elements.playerHand.classList.add('winner');
      break;
    case 'win':
      message = 'You Win!';
      winnings = gameState.currentBet * 2; // Original + 1:1
      elements.playerHand.classList.add('winner');
      elements.dealerHand.classList.add('loser');
      break;
    case 'lose':
      message = 'Dealer Wins';
      winnings = 0;
      elements.playerHand.classList.add('loser');
      elements.dealerHand.classList.add('winner');
      break;
    case 'push':
      message = 'Push';
      winnings = gameState.currentBet; // Return bet
      break;
  }

  gameState.bankroll += winnings;
  saveBankroll();

  showResult(message, result);

  // Animate bankroll
  if (winnings > gameState.currentBet) {
    updateBankrollDisplay('win');
  } else if (winnings === 0) {
    updateBankrollDisplay('lose');
  } else {
    updateBankrollDisplay();
  }

  // Reset bet for next hand
  gameState.currentBet = 25;

  // Show deal button or restart
  setTimeout(() => {
    if (!checkBroke()) {
      showDealButton();
    }
  }, 1000);
}

function restart() {
  gameState.bankroll = 500;
  gameState.currentBet = 25;
  saveBankroll();
  updateBankrollDisplay();
  hideResult();

  elements.dealerHand.innerHTML = '';
  elements.playerHand.innerHTML = '';
  elements.dealerValue.textContent = '';
  elements.playerValue.textContent = '';
  elements.dealerHand.classList.remove('winner', 'loser');
  elements.playerHand.classList.remove('winner', 'loser');

  elements.btnRestart.style.display = 'none';
  showDealButton();
  setButtonsEnabled(false, false, false);
  gameState.phase = 'betting';
}

// Event Listeners
function setupEventListeners() {
  elements.btnDeal.addEventListener('click', deal);
  elements.btnHit.addEventListener('click', hit);
  elements.btnStand.addEventListener('click', stand);
  elements.btnDouble.addEventListener('click', doubleDown);
  elements.btnRestart.addEventListener('click', restart);
}

// Start the game
init();
