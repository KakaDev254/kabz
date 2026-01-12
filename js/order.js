// ==============================
// CART DATA
// ==============================
let cart = {};

// ==============================
// UPDATE CART COUNT (BOTTOM LEFT)
// ==============================
function updateCartCount() {
  let totalQty = 0;

  for (let item in cart) {
    totalQty += cart[item].qty;
  }

  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    cartCountEl.innerText = totalQty;
  }
}

// ==============================
// UPDATE ITEM QTY DISPLAY
// ==============================
function updateQtyDisplay(item) {
  const qtyEl = document.getElementById(`qty-${item}`);
  if (qtyEl && cart[item]) {
    qtyEl.innerText = cart[item].qty;
  }
}

// ==============================
// INCREASE QTY
// ==============================
function increaseQty(item, price) {
  if (!cart[item]) {
    cart[item] = {
      price: price,
      qty: 1,
    };
  } else {
    cart[item].qty++;
  }

  updateQtyDisplay(item);
  updateCartCount();
}

// ==============================
// DECREASE QTY
// ==============================
function decreaseQty(item) {
  if (!cart[item]) return;

  cart[item].qty--;

  if (cart[item].qty <= 0) {
    delete cart[item];

    const qtyEl = document.getElementById(`qty-${item}`);
    if (qtyEl) {
      qtyEl.innerText = 0;
    }
  } else {
    updateQtyDisplay(item);
  }

  updateCartCount();
}

// ==============================
// OPEN ORDER SUMMARY MODAL
// ==============================
function openModal() {
  const branch = document.getElementById("branchSelect").value;

  if (!branch) {
    alert("Please select a branch");
    return;
  }

  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty");
    return;
  }

  renderOrderSummary();
  document.getElementById("orderModal").classList.remove("hidden");
}

// ==============================
// CLOSE MODAL
// ==============================
function closeModal() {
  document.getElementById("orderModal").classList.add("hidden");
}

// ==============================
// RENDER ORDER SUMMARY
// ==============================
function renderOrderSummary() {
  const summaryEl = document.getElementById("orderSummary");
  const totalEl = document.getElementById("modalTotal");

  summaryEl.innerHTML = "";
  let total = 0;

  for (let item in cart) {
    const qty = cart[item].qty;
    const price = cart[item].price;
    const itemTotal = qty * price;

    total += itemTotal;

    const row = document.createElement("div");
    row.className = "summary-item";
    row.innerHTML = `
      <span>${item} x${qty}</span>
      <span>KES ${itemTotal}</span>
    `;

    summaryEl.appendChild(row);
  }

  totalEl.innerText = total;
}

// ==============================
// CONFIRM ORDER (FROM MODAL)
// ==============================
function confirmOrder() {
  closeModal();
  sendOrder();
}

// ==============================
// SEND ORDER TO WHATSAPP
// ==============================
function sendOrder() {
  const branch = document.getElementById("branchSelect").value;

  if (!branch) {
    alert("Please select a branch");
    return;
  }

  if (Object.keys(cart).length === 0) {
    alert("Please add at least one item");
    return;
  }

  const phone = "254722126300"; // Kabz WhatsApp number
  const noteField = document.getElementById("orderNote");
  const note = noteField ? noteField.value.trim() : "";

  let message = "Hello Kabz 👋%0A%0A";
  message += `📍 Branch: ${branch}%0A%0A`;
  message += "🍽 Order:%0A";

  let total = 0;

  for (let item in cart) {
    const qty = cart[item].qty;
    const price = cart[item].price;
    const itemTotal = qty * price;

    total += itemTotal;

    message += `- ${item} x${qty} = KES ${itemTotal}%0A`;
  }

  message += `%0A💰 Total: KES ${total}`;

  // ADD DELIVERY / PICKUP NOTE IF PRESENT
  if (note) {
    message += `%0A%0A📝 Note:%0A${note}`;
  }

  message += `%0A%0AThank you!`;

  const whatsappURL = `https://wa.me/${phone}?text=${message}`;
  window.open(whatsappURL, "_blank");

  // OPTIONAL: clear note after sending
  if (noteField) {
    noteField.value = "";
  }
}
