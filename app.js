import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const menuContainer = document.getElementById('menu');
const orderList = document.getElementById('order-list');
const totalPriceElement = document.getElementById('total-price');
const calculatorDisplay = document.getElementById('calculator-display');
const calculatorButtons = document.getElementById('calculator-buttons');
const amountPaidInput = document.getElementById('amount-paid');
const calculateChangeButton = document.getElementById('calculate-change');
const changeAmountElement = document.getElementById('change-amount');

let menuItems = [];
let order = [];
let totalPrice = 0;

// Загрузка меню
async function loadMenu() {
  const querySnapshot = await getDocs(collection(db, "menu"));
  querySnapshot.forEach((doc) => {
    const item = doc.data();
    menuItems.push(item); // Сохраняем пункты меню в массив

    // Добавляем пункт меню в список
    const itemElement = document.createElement('div');
    itemElement.className = 'menu-item';
    itemElement.innerHTML = `
      <h3>${item.name}</h3>
      <p>Цена: ${item.price} руб.</p>
      <label>
        Количество: 
        <input type="number" value="1" min="1" class="item-quantity">
      </label>
      <button onclick="addToOrder('${item.name}', ${item.price}, this)">Добавить в заказ</button>
    `;
    menuContainer.appendChild(itemElement);
  });
}

// Добавление в заказ
window.addToOrder = function(name, price, button) {
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
}

// Обновление списка заказов
function updateOrder() {
  orderList.innerHTML = '';
  order.forEach((item, index) => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <span>${item.name} x${item.quantity} - ${item.price * item.quantity} руб.</span>
      <button onclick="removeFromOrder(${index})">Удалить</button>
    `;
    orderList.appendChild(orderItem);
  });
  totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Удаление из заказа
window.removeFromOrder = function(index) {
  const removedItem = order[index];
  totalPrice -= removedItem.price * removedItem.quantity;
  order.splice(index, 1);
  updateOrder();
}

// Калькулятор
let currentInput = '';
let operator = '';
let firstOperand = '';
let secondOperand = '';

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

// Расчет сдачи
calculateChangeButton.addEventListener('click', () => {
  const amountPaid = parseFloat(amountPaidInput.value);
  if (isNaN(amountPaid)) {
    alert('Введите корректную сумму');
    return;
  }
  const change = amountPaid - totalPrice;
  if (change < 0) {
    alert('Недостаточно средств');
    changeAmountElement.textContent = '0';
  } else {
    changeAmountElement.textContent = change.toFixed(2);
  }
});

// Загрузка меню при загрузке страницы
window.addEventListener("load", function() {
  loadMenu();
});