// Данные меню
const menuItems = [
  { name: "ШАУРМА Классическая", price: 190, category: "Шаурма" },
  { name: "ШАУРМА Острая", price: 210, category: "Шаурма" },
  { name: "ШАУРМА Экзотическая", price: 210, category: "Шаурма" },
  { name: "ШАУРМА Сырная", price: 220, category: "Шаурма" },
  { name: "ШАУРМА Грибная", price: 230, category: "Шаурма" },
  { name: "ШАУРМА С вишней", price: 235, category: "Шаурма" },
  { name: "ШАУРМА Биг тесто", price: 245, category: "Шаурма" },
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

// Элементы для поиска
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Элементы калькулятора
const calculatorDisplay = document.getElementById('calculator-display');
const calculatorButtons = document.getElementById('calculator-buttons');

// Переменные для калькулятора
let currentInput = '';
let operator = '';
let firstOperand = '';
let secondOperand = '';

// Обработчик для кнопок калькулятора
calculatorButtons.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const value = e.target.dataset.value;

    if (value === 'C') {
      // Очистка калькулятора
      currentInput = '';
      operator = '';
      firstOperand = '';
      secondOperand = '';
      calculatorDisplay.value = '';
    } else if (value === '=') {
      // Вычисление результата
      if (firstOperand && operator && currentInput) {
        secondOperand = currentInput;
        const result = calculate(firstOperand, operator, secondOperand);
        calculatorDisplay.value = result;
        currentInput = result;
        operator = '';
        firstOperand = '';
        secondOperand = '';
      }
    } else if (['+', '-', '*', '/'].includes(value)) {
      // Установка оператора
      if (currentInput) {
        firstOperand = currentInput;
        operator = value;
        currentInput = '';
      }
    } else {
      // Ввод чисел
      currentInput += value;
      calculatorDisplay.value = currentInput;
    }
  }
});

// Функция для вычисления
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

// Элементы для заказа
const orderList = document.getElementById('order-list');
const totalPriceElement = document.getElementById('total-price');

// Элементы для расчёта сдачи
const amountPaidInput = document.getElementById('amount-paid');
const calculateChangeButton = document.getElementById('calculate-change');
const changeAmountElement = document.getElementById('change-amount');

// Переменные для заказа
let order = [];
let totalPrice = 0;

// Функция для отображения меню
function displayMenu(items = menuItems) {
  const menuContainer = document.getElementById('menu');
  menuContainer.innerHTML = ''; // Очищаем контейнер

  // Группируем по категориям
  const categories = {};
  items.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  // Отображаем категории и элементы меню
  for (const category in categories) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category';
    categoryElement.innerHTML = `<h2>${category}</h2>`;
    menuContainer.appendChild(categoryElement);

    categories[category].forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'menu-item';
      itemElement.innerHTML = `
        <h3>${item.name}</h3>
        <p>Цена: ${item.price}₽</p>
        <label>
          Количество: 
          <input type="number" value="1" min="1" class="item-quantity">
        </label>
        <button onclick="addToOrder('${item.name}', ${item.price}, this)">Добавить в заказ</button>
      `;
      menuContainer.appendChild(itemElement);
    });
  }
}

// Функция для добавления в заказ
window.addToOrder = function (name, price, button) {
  const quantityInput = button.previousElementSibling.querySelector('.item-quantity');
  const quantity = parseInt(quantityInput.value, 10);

  if (isNaN(quantity) || quantity <= 0) {
    alert('Введите корректное количество');
    return;
  }

  const totalItemPrice = price * quantity;
  order.push({ name, price, quantity });
  totalPrice += totalItemPrice;
  updateOrder();
};

// Функция для обновления списка заказов
function updateOrder() {
  orderList.innerHTML = '';
  order.forEach((item, index) => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <span>${item.name} x${item.quantity} - ${item.price * item.quantity}₽</span>
      <button onclick="removeFromOrder(${index})">Удалить</button>
    `;
    orderList.appendChild(orderItem);
  });

  totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Функция для удаления из заказа
window.removeFromOrder = function (index) {
  const removedItem = order[index];
  totalPrice -= removedItem.price * removedItem.quantity;
  order.splice(index, 1);
  updateOrder();
};

// Функция для расчёта сдачи
calculateChangeButton.addEventListener('click', () => {
  const amountPaid = parseFloat(amountPaidInput.value); // Сумма, которую внёс клиент
  if (isNaN(amountPaid)) {
    alert('Введите корректную сумму');
    return;
  }

  const change = amountPaid - totalPrice; // Расчёт сдачи
  if (change < 0) {
    alert('Недостаточно средств');
    changeAmountElement.textContent = '0';
  } else {
    changeAmountElement.textContent = change.toFixed(2); // Отображаем сдачу
  }
});

// Функция для фильтрации меню
function filterMenu(searchTerm) {
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayMenu(filteredItems); // Отображаем отфильтрованное меню
}

// Обработчик для кнопки поиска
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    filterMenu(searchTerm);
  } else {
    displayMenu(menuItems); // Если поле пустое, показываем всё меню
  }
});

// Обработчик для поиска при вводе (опционально)
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    filterMenu(searchTerm);
  } else {
    displayMenu(menuItems); // Если поле пустое, показываем всё меню
  }
});

// Инициализация
window.addEventListener("load", function () {
  displayMenu(); // Отображаем меню при загрузке страницы
});