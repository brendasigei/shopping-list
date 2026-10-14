// get the main form inputs and list area
const itemInput = document.querySelector('input[type="text"]');
const priceInput = document.querySelector('input[type="number"]');
const itemList = document.querySelector('ul');
const headingList = document.querySelectorAll('h1');
const totalHeading = headingList[headingList.length - 1];

// key used to save the shopping list in browser storage
const storageKey = 'shopping-items';

// read saved items from local storage
function getSavedItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

// keep the current items in memory
let shoppingItems = getSavedItems();

// save items so they stay after reload
function saveItems() {
  localStorage.setItem(storageKey, JSON.stringify(shoppingItems));
}

// make prices show in kenyan shillings
function formatMoney(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(value);
}

// add the purchased items cost to the total
function updateTotal() {
  const total = shoppingItems.reduce((sum, item) => {
    return sum + (item.purchased ? Number(item.price) || 0 : 0);
  }, 0);

  totalHeading.textContent = `Total cost : ${formatMoney(total)}`;
}

// rebuild the item list on screen
function renderList() {
  itemList.innerHTML = '';

  shoppingItems.forEach((item) => {
    const listItem = document.createElement('li');

    const textGroup = document.createElement('div');
    textGroup.style.display = 'flex';
    textGroup.style.flexDirection = 'column';
    textGroup.style.gap = '4px';

    const name = document.createElement('span');
    name.textContent = item.name;

    const priceText = document.createElement('small');
    priceText.textContent = formatMoney(item.price);
    priceText.style.color = '#666';

    textGroup.appendChild(name);
    textGroup.appendChild(priceText);

    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.textContent = item.purchased ? 'Purchased' : 'Mark purchase';
    actionButton.className = item.purchased ? 'markButton purchased' : 'markButton';

    actionButton.addEventListener('click', () => {
      item.purchased = !item.purchased;
      saveItems();
      renderList();
      updateTotal();
    });

    listItem.appendChild(textGroup);
    listItem.appendChild(actionButton);
    itemList.appendChild(listItem);
  });
}

// add a new shopping item
function addItem(event) {
  event.preventDefault();

  const itemName = itemInput.value.trim();
  const itemPrice = Number(priceInput.value);

  if (!itemName || !itemPrice || itemPrice <= 0) {
    alert('Please fill in the item and price before adding.');
    return;
  }

  shoppingItems.push({
    name: itemName,
    price: itemPrice,
    purchased: false
  });

  saveItems();
  itemInput.value = '';
  priceInput.value = '';
  renderList();
  updateTotal();
}

// remove all items from the list
function clearAllItems(event) {
  event.preventDefault();
  shoppingItems = [];
  saveItems();
  renderList();
  updateTotal();
}

// find the add and clear buttons
const buttons = Array.from(document.querySelectorAll('button'));
const addButton = buttons.find((button) => button.textContent.toLowerCase().includes('add'));
const clearButton = buttons.find((button) => button.textContent.toLowerCase().includes('clear'));

// connect button actions
if (addButton) {
  addButton.addEventListener('click', addItem);
}

if (clearButton) {
  clearButton.addEventListener('click', clearAllItems);
}

// show the list when the page loads
renderList();
updateTotal();
