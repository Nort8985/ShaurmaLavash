// Данные меню
const menuItems = [
  { name: "ШАУРМА Классическая", price: 190, category: "Шаурма" },
  { name: "ШАУРМА Острая", price: 210, category: "Шаурма" },
  { name: "ШАУРМА Экзотическая", price: 210, category: "Шаурма" },
  { name: "ШАУРМА Сырная", price: 220, category: "Шаурма" },
  { name: "ШАУРМА Грибная", price: 230, category: "Шаурма" },
  { name: "ШАУРМА С вишней", price: 235, category: "Шаурма" },
  { name: "ШАУРМА Биг тэсти", price: 245, category: "Шаурма" },
  { name: "СОСИСКА В ЛАВАШЕ С овощами", price: 120, category: "Сосиски в лаваше" },
  { name: "СОСИСКА В ЛАВАШЕ С сыром", price: 135, category: "Сосиски в лаваше" },
  { name: "Картофель фри", price: 85, category: "Снеки" },
  { name: "Наггетсы", price: 110, category: "Снеки" },
  { name: "Сырные палочки", price: 115, category: "Снеки" },
  { name: "Эспрессо", price: 60, category: "Горячие напитки" },
  { name: "Американо", price: 80, category: "Горячие напитки" },
  { name: "Капучино", price: 100, category: "Горячие напитки" },
  { name: "Латте", price: 100, category: "Горячие напитки" },
  { name: "Чай", price: 45, category: "Горячие напитки" },
  { name: "Котлета", price: 90, category: "Снеки" },
];

// Класс для управления заказом
class OrderManager {
  constructor() {
    this.order = [];
    this.totalPrice = 0;
  }

  addItem(name, price, quantity) {
    quantity = Math.max(1, parseInt(quantity) || 1);
    this.order.push({ name, price, quantity });
    this.totalPrice += price * quantity;
  }

  removeItem(index) {
    if (index >= 0 && index < this.order.length) {
      const removedItem = this.order.splice(index, 1)[0];
      this.totalPrice -= removedItem.price * removedItem.quantity;
      return true;
    }
    return false;
  }
}

const orderManager = new OrderManager();

// Отображение меню
function displayMenu(items = menuItems) {
  const menuContainer = document.getElementById('menu');
  menuContainer.innerHTML = '';

  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  for (const [category, items] of Object.entries(categories)) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category';
    categoryElement.innerHTML = `<h2>${category}</h2>`;
    menuContainer.appendChild(categoryElement);

    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'menu-item';
      itemElement.innerHTML = `
        <h3>${item.name}</h3>
        <p>Цена: ${item.price}₽</p>
        <label>
          Количество:
          <input type="number" class="item-quantity" value="1" min="1">
        </label>
        <button>
          <i class="fas fa-cart-plus"></i> Добавить
        </button>
      `;
      itemElement.querySelector('button').addEventListener('click', () => {
        const quantity = +itemElement.querySelector('.item-quantity').value;
        orderManager.addItem(item.name, item.price, quantity);
        updateOrderDisplay();
      });
      menuContainer.appendChild(itemElement);
    });
  }
}

// Обновление заказа
function updateOrderDisplay() {
  const orderList = document.getElementById('order-list');
  orderList.innerHTML = '';

  orderManager.order.forEach((item, index) => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <span>${item.name} x${item.quantity} — ${(item.price * item.quantity).toLocaleString('ru-RU')}₽</span>
      <div>
        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
        <button onclick="handleRemoveItem(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    orderList.appendChild(orderItem);
  });

  document.getElementById('total-price').textContent = orderManager.totalPrice.toLocaleString('ru-RU', {minimumFractionDigits: 2});
}

// Редактирование количества
window.updateQuantity = (index, newQuantity) => {
  newQuantity = Math.max(1, newQuantity);
  const item = orderManager.order[index];
  orderManager.totalPrice -= item.price * item.quantity;
  item.quantity = +newQuantity;
  orderManager.totalPrice += item.price * item.quantity;
  updateOrderDisplay();
};

// Удаление из заказа
window.handleRemoveItem = (index) => {
  if (confirm("Удалить позицию из заказа?")) {
    if (orderManager.removeItem(index)) {
      updateOrderDisplay();
    }
  }
};

// Калькулятор
let currentInput = '';
let operator = '';
let firstOperand = '';
const calculatorDisplay = document.getElementById('calculator-display');

document.getElementById('calculator-buttons').addEventListener('click', (e) => {
  if (!e.target.matches('button')) return;
  const value = e.target.dataset.value;

  if (value === 'C') {
    currentInput = '';
    operator = '';
    firstOperand = '';
    calculatorDisplay.value = '';
  } else if (value === '←') {
    currentInput = currentInput.slice(0, -1);
    calculatorDisplay.value = currentInput;
  } else if (value === '=') {
    if (firstOperand && operator && currentInput) {
      const result = calculate(firstOperand, operator, currentInput);
      calculatorDisplay.value = result;
      currentInput = result.toString();
      operator = '';
      firstOperand = '';
    }
  } else if (['+', '-', '*', '/'].includes(value)) {
    if (currentInput && !operator) {
      firstOperand = currentInput;
      operator = value;
      currentInput = '';
    }
  } else {
    currentInput += value;
    calculatorDisplay.value = currentInput;
  }
});

function calculate(a, op, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
    default: return 0;
  }
}

// Расчет сдачи мелкими
document.getElementById('calculate-change').addEventListener('click', () => {
  const paid = parseFloat(document.getElementById('amount-paid').value);
  if (isNaN(paid)) {
    alert('Введите корректную сумму!');
    return;
  }

  const change = paid - orderManager.totalPrice;
  const changeElement = document.getElementById('change-amount');

  if (change >= 0) {
    let cashToAsk = 0;
    let target = 0;

    if (change > 50) {
      // Округляем до ближайших 100
      target = 100 * Math.ceil(change / 100);
      cashToAsk = target - change;
    } else {
      // Округляем до 50
      target = 50;
      cashToAsk = 50 - change;
    }

    // Форматируем вывод
    changeElement.innerHTML = cashToAsk === 0 
      ? `✅ <strong>${change.toFixed(2)}₽</strong> (без доплаты)` 
      : `✅ <strong>${change.toFixed(2)}₽</strong><br>Попросить ${cashToAsk}₽ для ${target}₽`;
  } else {
    changeElement.textContent = `❌ Не хватает: ${Math.abs(change).toFixed(2)}₽`;
  }
});

// Поиск
let searchTimeout;
document.getElementById('search-input').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const filteredItems = menuItems.filter(item => 
      item.name.toLowerCase().includes(e.target.value.trim().toLowerCase())
    );
    displayMenu(filteredItems);
  }, 300);
});

// Загрузка страницы
window.addEventListener('load', () => {
  displayMenu();
});