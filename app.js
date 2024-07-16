document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:3000/products";
    const productList = document.getElementById("product-list");
    const productForm = document.getElementById("product-form");
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const descriptionInput = document.getElementById("description");
  
    // Fetch and display products
    function fetchProducts() {
      fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
          productList.innerHTML = "";
          products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.className = "product";
            productElement.innerHTML = `
              <h3>${product.name}</h3>
              <p>Price: $${product.price}</p>
              <p>${product.description}</p>
              <button onclick="deleteProduct(${product.id})">Delete</button>
              <button onclick="editProduct(${product.id})">Edit</button>
            `;
            productList.appendChild(productElement);
          });
        });
    }
  
    // Add a new product
    productForm.addEventListener("submit", event => {
      event.preventDefault();
      const newProduct = {
        name: nameInput.value,
        price: priceInput.value,
        description: descriptionInput.value
      };
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
      })
        .then(response => response.json())
        .then(() => {
          fetchProducts();
          productForm.reset();
        });
    });
  
    // Delete a product
    window.deleteProduct = function(id) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
      })
        .then(() => fetchProducts());
    };
  
    // Edit a product
    window.editProduct = function(id) {
      fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(product => {
          nameInput.value = product.name;
          priceInput.value = product.price;
          descriptionInput.value = product.description;
          productForm.onsubmit = function(event) {
            event.preventDefault();
            const updatedProduct = {
              name: nameInput.value,
              price: priceInput.value,
              description: descriptionInput.value
            };
            fetch(`${apiUrl}/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatedProduct)
            })
              .then(response => response.json())
              .then(() => {
                fetchProducts();
                productForm.reset();
                productForm.onsubmit = addProduct;
              });
          };
        });
    };
  
    fetchProducts();
  });
  