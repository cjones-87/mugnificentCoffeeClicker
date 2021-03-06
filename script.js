function updateCoffeeView(coffeeQty) {
  const coffeeCount = document.getElementById('coffee_counter');
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
  return data.producers.filter((producer) => producer.unlocked);
}

function makeDisplayNameFromId(id) {
  return id
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
      <div class="producer-column">
        <div class="producer-title">${displayName}</div>
        <button type="button" id="buy_${producer.id}">Buy</button>
      </div>
      <div class="producer-column">
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
  const producerContainer = document.getElementById('producer_container');

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
  document.getElementById('cps').innerText = cps;
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
    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
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
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

if (typeof process === 'undefined') {
  const data = window.data;

  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', (event) => {
    buyButtonClick(event, data);
  });

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
