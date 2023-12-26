const resetButton = document.getElementById('startOver');
resetButton.addEventListener("click", () => {
  localStorage.removeItem("gameState");
  location.reload();
});

function updateCoffeeView(coffeeQty) {
  const coffeeCount = document.getElementById("coffeeCounter");
  coffeeCount.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

function unlockProducers(producers, coffeeCount) {
  producers.forEach((producer) => {
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  const unlockedProducers = data.producers.filter(
    (producer) => producer.unlocked
  );

  return unlockedProducers;
}

function makeDisplayNameFromId(id) {
  return id
    .split(/_/g)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function makeProducerDiv(producer) {
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
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  const producerContainer = document.getElementById('producerContainer');

  unlockProducers(data.producers, data.coffee);

  deleteAllChildNodes(producerContainer);

  getUnlockedProducers(data).forEach((producer) =>
    producerContainer.appendChild(makeProducerDiv(producer))
  );
}

function getProducerById(data, producerId) {
  return data.producers.find((producer) => producer.id === producerId);
}

function canAffordProducer(data, producerId) {
  return data.coffee >= getProducerById(data, producerId).price ? true : false;
}

function updateCPSView(cps) {
  document.getElementById("cps").innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.11);
}

function attemptToBuyProducer(data, producerId) {
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
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    const producer = event.target.id.slice(4);
    const trueOrFalse = attemptToBuyProducer(data, producer);

    if (!trueOrFalse) {
      window.alert("Not enough coffee!");
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

const saveGameState = (data) =>
  localStorage.setItem("gameState", JSON.stringify(data));

const initializeGameState = () => {
  const savedGameState = localStorage.getItem("gameState");
  return savedGameState ? JSON.parse(savedGameState) : getDefaultGameState();
};

const getDefaultGameState = () => window.data;

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);

  saveGameState(data);
}

if (typeof process === "undefined") {
  const data = initializeGameState();

  const bigCoffee = document.getElementById("bigCoffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  const producerContainer = document.getElementById("producerContainer");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  renderProducers(data);
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);

  setInterval(() => tick(data), 1000);
} else if (process) {
  module.exports = {
    updateCoffeeView,
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
