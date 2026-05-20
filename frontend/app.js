const API = "http://localhost:5000/api/products";

async function loadProducts() {
  const res = await fetch(API);
  const data = await res.json();

  document.getElementById("products").innerHTML =
    data.map(p => `
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="alert('Added to cart')">Add to Cart</button>
      </div>
    `).join("");
}

loadProducts();