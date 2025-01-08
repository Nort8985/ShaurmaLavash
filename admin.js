import { db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const form = document.getElementById('price-form');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  
  const itemName = document.getElementById('item-name').value;
  const itemPrice = document.getElementById('item-price').value;

  await setDoc(doc(db, "menu", itemName), {
    name: itemName,
    price: itemPrice
  });

  alert('Цена изменена');
  form.reset();
});