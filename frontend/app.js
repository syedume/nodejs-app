const API = "http://backend:7400";

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const data = await res.json();

  document.getElementById("app").innerHTML = `
    <h1>🛒 Mini E-Commerce Store</h1>
    <div style="display:flex;gap:20px;flex-wrap:wrap">
      ${data.map(p => `
        <div style="border:1px solid #ccc;padding:10px;width:200px">
          <h3>${p.name}</h3>
          <p>💰 ₹${p.price}</p>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      `).join("")}
    </div>
  `;
}

async function addToCart(id) {
  await fetch(`${API}/cart/${id}`, { method: "POST" });
  alert("Added to cart!");
}

loadProducts();