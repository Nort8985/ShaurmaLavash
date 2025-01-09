import { db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const form = document.getElementById('price-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const itemName = document.getElementById('item-name').value;
  const itemPrice = document.getElementById('item-price').value;
  const itemCategory = document.getElementById('item-category').value;

  await setDoc(doc(db, "menu", itemName), {
    name: itemName,
    price: itemPrice,
    category: itemCategory
  });

  alert('Товар добавлен/цена изменена');
  form.reset();
});