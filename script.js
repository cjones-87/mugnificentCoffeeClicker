const resetButton = document.getElementById('startOver');
resetButton.addEventListener('click', () => {
  localStorage.removeItem('gameState');
  location.reload();
});

const clickCoffee = (data) => {
  data.coffee++;
  data.lifetimeEarnings++;
  updateCoffeeView(data.coffee);
  updateLifetimeEarningsView(data.lifetimeEarnings);
  renderProducers(data);
};
const updateCoffeeView = (coffeeQty) => {
  const coffeeCount = document.getElementById('coffeeCounter');
  coffeeCount.innerText = coffeeQty;
};

const updateLifetimeEarningsView = (totalEarnings) => {
  const lifetimeEarnings = document.getElementById('lifetimeEarnings');
  lifetimeEarnings.innerText = totalEarnings;
};

const unlockProducers = (producers, coffeeCount) => {
  producers.forEach((producer) => {
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  });
};

const getUnlockedProducers = (data) => {
  const unlockedProducers = data.producers.filter(
    (producer) => producer.unlocked
  );

  return unlockedProducers;
};

const makeDisplayNameFromId = (id) =>
  id
    .split(/_/g)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

const makeProducerDiv = (producer) => {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
      <div class="producerColumn">
        <div class="producerTitle">${displayName}</div>
        <button type="button" id="buy_${producer.id}">Buy</button>
      </div>
      <div class="producerColumn">
        <div>Quantity: ${producer.qty}</div>
        <div>Coffee/second: ${producer.cps}</div>
        <div>Cost: ${currentCost} coffee</div>
      </div>
      `;
  containerDiv.innerHTML = html;
  return containerDiv;
};

const deleteAllChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const renderProducers = (data) => {
  const producerContainer = document.getElementById('producerContainer');

  unlockProducers(data.producers, data.coffee);

  deleteAllChildNodes(producerContainer);

  getUnlockedProducers(data).forEach((producer) =>
    producerContainer.appendChild(makeProducerDiv(producer))
  );
};

const getProducerById = (data, producerId) =>
  data.producers.find((producer) => producer.id === producerId);

const canAffordProducer = (data, producerId) =>
  data.coffee >= getProducerById(data, producerId).price;

const updateCPSView = (cps) => (document.getElementById('cps').innerText = cps);

const updatePrice = (oldPrice) => {
  return Math.floor(oldPrice * 1.11);
};

const attemptToBuyProducer = (data, producerId) => {
  if (canAffordProducer(data, producerId)) {
    const producer = getProducerById(data, producerId);
    producer.qty++;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;

    saveGameState(data);
    return true;
  } else {
    return false;
  }
};

const buyButtonClick = (event, data) => {
  if (event.target.tagName === 'BUTTON') {
    const producer = event.target.id.slice(4);
    const trueOrFalse = attemptToBuyProducer(data, producer);

    if (!trueOrFalse) {
      window.alert('Not enough coffee!');
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
};

const saveDisconnectTime = () =>
  localStorage.setItem('disconnectTime', new Date().getTime());

const calculateOfflineProgress = (data) => {
  const disconnectTime = +localStorage.getItem('disconnectTime');

  if (!isNaN(disconnectTime) && disconnectTime > 0) {
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - disconnectTime) / 1000);
    const offlineEarnings = elapsedSeconds * Math.ceil(data.totalCPS * 0.5);

    data.coffee += offlineEarnings;
    data.lifetimeEarnings += offlineEarnings;
    updateCoffeeView(data.coffee);
    updateLifetimeEarningsView(data.lifetimeEarnings);

    window.alert(`Your lifetime earnings were: ${offlineEarnings}`);
  }

  localStorage.removeItem('disconnectTime');
};

const saveGameState = (data) =>
  localStorage.setItem('gameState', JSON.stringify(data));

const initializeGameState = () => {
  const savedGameState = localStorage.getItem('gameState');
  return savedGameState ? JSON.parse(savedGameState) : getDefaultGameState();
};

const getDefaultGameState = () => window.data;

const tick = (data) => {
  calculateOfflineProgress(data);

  data.coffee += data.totalCPS;
  data.lifetimeEarnings += data.totalCPS;
  updateCoffeeView(data.coffee);
  updateLifetimeEarningsView(data.lifetimeEarnings);
  renderProducers(data);

  saveGameState(data);
};

if (typeof process === 'undefined') {
  const data = initializeGameState();

  window.addEventListener('beforeunload', () => saveDisconnectTime());

  const bigCoffee = document.getElementById('bigCoffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  const producerContainer = document.getElementById('producerContainer');
  producerContainer.addEventListener('click', (event) => {
    buyButtonClick(event, data);
  });

  renderProducers(data);
  updateCoffeeView(data.coffee);
  updateLifetimeEarningsView(data.lifetimeEarnings);
  updateCPSView(data.totalCPS);

  setInterval(() => tick(data), 1000);
} else if (process) {
  module.exports = {
    updateCoffeeView,
    updateLifetimeEarningsView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
