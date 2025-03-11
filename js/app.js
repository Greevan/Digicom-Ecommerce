// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyAoerhj76z6AUh-2uOVSleIsiWDHGPsjcM",
  authDomain: "ecommerce-bc87c.firebaseapp.com",
  projectId: "ecommerce-bc87c",
  storageBucket: "ecommerce-bc87c.firebasestorage.app",
  messagingSenderId: "1087005483077",
  appId: "1:1087005483077:web:2e4d89e9397f01b347832c",
  measurementId: "G-DNLW0LWTCK"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Navigation function
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  if (sectionId === 'products') loadProducts();
  if (sectionId === 'cart') loadCart();
  if (sectionId === 'history') loadHistory();
}

// Function to revert back to the Login form
function showLogin(event) {
  if (event) event.preventDefault();
  const loginFormContainer = document.querySelector('#login .form-container');
  loginFormContainer.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <input type="email" id="loginEmail" placeholder="Email" required>
      <input type="password" id="loginPassword" placeholder="Password" required>
      <select id="loginRole" required>
        <option value="" disabled selected>Select Role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" class="btn">Login</button>
    </form>
    <div id="loginMessage" class="message"></div>
    <div class="new-user">
      New user? <a href="#signup" onclick="showSignUp(event)" class="signup-link">Sign Up</a>
    </div>
  `;

  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    auth.signInWithEmailAndPassword(email, password)
      .then(cred => {
        currentUser = cred.user;
        document.getElementById('loginMessage').innerText = "Login successful!";

        const isAdmin = email === "admin@g.com";

        if (role === "admin") {
          if (isAdmin) {
            window.location.href = "admin.html";
          } else {
            document.getElementById('loginMessage').innerText = "Not authorized as admin.";
            auth.signOut();
          }
        } else {
          showSection('products');
        }
      })
      .catch(err => {
        document.getElementById('loginMessage').innerText = err.message;
      });
  });
}

// Dynamically show Sign Up form when "Sign Up" link is clicked
function showSignUp(event) {
  event.preventDefault();
  const loginFormContainer = document.querySelector('#login .form-container');
  loginFormContainer.innerHTML = `
    <h2>Sign Up</h2>
    <form id="signUpForm">
      <input type="email" id="signUpEmail" placeholder="Email" required>
      <input type="password" id="signUpPassword" placeholder="Password" required>
      <button type="submit" class="btn">Sign Up</button>
    </form>
    <div id="signUpMessage" class="message"></div>
    <div class="back-to-login">
      <a href="#login" onclick="showLogin(event)" class="back-link">Back to Login</a>
    </div>
  `;

  document.getElementById('signUpForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        currentUser = cred.user;
        document.getElementById('signUpMessage').innerText = "Registration successful! Please sign in.";
        return db.collection('users').doc(currentUser.uid).set({
          email: email,
          credit: 0
        });
      })
      .then(() => {
        showLogin(event);
      })
      .catch(err => {
        document.getElementById('signUpMessage').innerText = err.message;
      });
  });
}

// Initial call to show login form when page loads
document.addEventListener('DOMContentLoaded', () => {
  showLogin();
});

// Load products from Firestore
function loadProducts() {
  const productsListDiv = document.getElementById('productsList');
  productsListDiv.innerHTML = "Loading products...";

  db.collection('products').get()
    .then(snapshot => {
      productsListDiv.innerHTML = "";
      if (snapshot.empty) {
        showNotification("No products available.", true);
        return;
      }

      snapshot.forEach(doc => {
        const prod = doc.data();
        const imageUrl = prod.imageUrl || 'assets/images/broken.jpg';
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');

        if (prod.disabled) {
          productDiv.classList.add('disabled');
        }

        productDiv.innerHTML = `
          <img src="${imageUrl}" alt="${prod.name}" width="100" onerror="this.src='assets/images/broken.jpg'"/>
          <button class="add-to-cart" onclick="toggleQuantityControls('${doc.id}')">Add to Cart</button>
          <div class="product-details">
            <strong>${prod.name}</strong>
            <div class="description">${prod.description || 'No description available'}</div>
            <div class="price">₹${prod.price || 0}</div>
          </div>
          <div class="quantity-controls">
            <button onclick="decreaseQuantity('${doc.id}')">-</button>
            <span id="quantity-${doc.id}">1</span>
            <button onclick="increaseQuantity('${doc.id}')">+</button>
            <button class="confirm-btn" onclick="addToCart('${doc.id}')">Confirm</button>
          </div>
          <div id="stock-message-${doc.id}" class="stock-message"></div>
        `;

        if (prod.quantity < 10 && prod.quantity > 0) {
          const stockMsg = document.createElement('p');
          stockMsg.id = `stock-message-${doc.id}`;
          stockMsg.style.color = "red";
          stockMsg.style.fontWeight = "bold";
          stockMsg.innerText = `${prod.quantity} available`;
          productDiv.appendChild(stockMsg);
        } else if (prod.quantity === 0) {
          const stockMsg = document.createElement('p');
          stockMsg.id = `stock-message-${doc.id}`;
          stockMsg.style.color = "red";
          stockMsg.style.fontWeight = "bold";
          stockMsg.innerText = "Out of stock";
          productDiv.querySelector('.add-to-cart').disabled = true;
          productDiv.querySelector('.quantity-controls').style.display = 'none';
          productDiv.appendChild(stockMsg);
        }

        productsListDiv.appendChild(productDiv);
      });
    })
    .catch(err => {
      console.error("Error loading products:", err);
      showNotification("Error loading products.", true);
    });
}

// Toggle Quantity Controls
function toggleQuantityControls(productId) {
  const quantityControls = document.querySelector(`.product-item:has(#quantity-${productId}) .quantity-controls`);
  if (quantityControls) {
    quantityControls.classList.toggle('active');
    if (!quantityControls.classList.contains('active')) {
      document.getElementById(`quantity-${productId}`).innerText = 1;
    } else {
      checkStock(productId);
    }
  }
}

// Increase quantity (max 10, check stock)
function increaseQuantity(productId) {
  const qtySpan = document.getElementById(`quantity-${productId}`);
  let currentQty = parseInt(qtySpan.innerText);
  checkStock(productId, currentQty + 1, qtySpan);
}

// Decrease quantity (min 1)
function decreaseQuantity(productId) {
  const qtySpan = document.getElementById(`quantity-${productId}`);
  let currentQty = parseInt(qtySpan.innerText);
  if (currentQty > 1) {
    qtySpan.innerText = currentQty - 1;
    updateStockMessage(productId, currentQty - 1);
  }
}

// Check stock availability
function checkStock(productId, requestedQty = null, qtySpan = null) {
  db.collection('products').doc(productId).get()
    .then(doc => {
      if (doc.exists) {
        const prod = doc.data();
        const currentQty = requestedQty !== null ? requestedQty : parseInt(document.getElementById(`quantity-${productId}`).innerText);
        const availableQty = prod.quantity || 0;

        if (currentQty > availableQty) {
          showNotification(`Only ${availableQty} available.`, true);
          if (qtySpan) qtySpan.innerText = availableQty;
          updateStockMessage(productId, availableQty);
        } else {
          if (qtySpan) qtySpan.innerText = currentQty;
          updateStockMessage(productId, currentQty);
        }
      }
    })
    .catch(err => {
      console.error("Error checking stock:", err);
      showNotification("Error checking stock.", true);
    });
}

// Update stock message dynamically
function updateStockMessage(productId, qty) {
  const stockMessage = document.getElementById(`stock-message-${productId}`);
  if (stockMessage) {
    if (qty < 10 && qty > 0) {
      stockMessage.innerText = `${qty} available`;
      stockMessage.style.display = 'block';
    } else if (qty === 0) {
      stockMessage.innerText = "Out of stock";
      stockMessage.style.display = 'block';
      document.querySelector(`.product-item:has(#quantity-${productId}) .add-to-cart`).disabled = true;
      document.querySelector(`.product-item:has(#quantity-${productId}) .quantity-controls`).style.display = 'none';
    } else {
      stockMessage.style.display = 'none';
    }
  }
}

// Add to cart with selected quantity, update stock, and in-app notification
function addToCart(productId) {
  if (!currentUser) {
    showNotification("Please log in to add items to cart.", true);
    return;
  }

  const qtySpan = document.getElementById(`quantity-${productId}`);
  const quantity = parseInt(qtySpan.innerText);

  db.collection('products').doc(productId).get()
    .then(doc => {
      if (doc.exists) {
        const prod = doc.data();
        const availableQty = prod.quantity || 0;

        if (quantity > availableQty) {
          showNotification(`Only ${availableQty} available.`, true);
          qtySpan.innerText = availableQty;
          return;
        }

        const newStock = availableQty - quantity;
        db.collection('products').doc(productId).update({ quantity: newStock })
          .then(() => {
            const cartRef = db.collection('cart').doc(currentUser.uid).collection('items');
            cartRef.where('productId', '==', productId).get()
              .then(snapshot => {
                if (!snapshot.empty) {
                  const doc = snapshot.docs[0];
                  const newQty = Math.min(doc.data().quantity + quantity, 10);
                  doc.ref.update({ quantity: newQty })
                    .then(() => {
                      showNotification("Cart updated successfully!", false);
                      toggleQuantityControls(productId);
                      loadProducts();
                    })
                    .catch(err => {
                      showNotification("Error updating cart: " + err.message, true);
                    });
                } else {
                  cartRef.add({
                    productId: productId,
                    name: prod.name,
                    price: prod.price,
                    credit: prod.credit,
                    imageUrl: prod.imageUrl || 'assets/images/broken.jpg',
                    quantity: quantity
                  }).then(() => {
                    showNotification("Added to cart successfully!", false);
                    toggleQuantityControls(productId);
                    loadProducts();
                  })
                  .catch(err => {
                    showNotification("Error adding to cart: " + err.message, true);
                  });
                }
              })
              .catch(err => {
                showNotification("Error accessing cart: " + err.message, true);
              });
          })
          .catch(err => {
            showNotification("Error updating stock: " + err.message, true);
          });
      } else {
        showNotification("Product not found.", true);
      }
    })
    .catch(err => {
      showNotification("Error fetching product: " + err.message, true);
    });
}

// Show Notification Function
function showNotification(message, isError) {
  const notification = document.getElementById('notification');
  notification.innerText = message;
  notification.className = 'notification';
  if (isError) {
    notification.classList.add('error');
  }
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Increase/decrease cart quantity functions
function increaseCartQuantity(itemId) {
  if (!currentUser) return;

  const qtySpan = document.getElementById(`cart-quantity-${itemId}`);
  let currentQty = parseInt(qtySpan.innerText);
  let newQty = currentQty + 1;

  db.collection('cart').doc(currentUser.uid).collection('items').doc(itemId).update({
    quantity: newQty
  })
    .then(() => {
      qtySpan.innerText = newQty;
      loadCart();
    })
    .catch(err => {
      console.error("Error updating quantity:", err);
    });
}

function decreaseCartQuantity(itemId) {
  if (!currentUser) return;

  const qtySpan = document.getElementById(`cart-quantity-${itemId}`);
  let currentQty = parseInt(qtySpan.innerText);

  if (currentQty > 1) {
    let newQty = currentQty - 1;

    db.collection('cart').doc(currentUser.uid).collection('items').doc(itemId).update({
      quantity: newQty
    })
      .then(() => {
        qtySpan.innerText = newQty;
        loadCart();
      })
      .catch(err => {
        console.error("Error updating quantity:", err);
      });
  }
}

// Add to Wishlist
function addToWishlist(productId) {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  db.collection('products').doc(productId).get()
    .then(doc => {
      if (doc.exists) {
        const product = doc.data();
        const wishlistRef = db.collection('users').doc(currentUser.uid).collection('wishlist');

        wishlistRef.where('name', '==', product.name).get()
          .then(snapshot => {
            if (snapshot.empty) {
              wishlistRef.add(product)
                .then(() => {
                  alert(`${product.name} added to wishlist.`);
                  loadWishlist();
                })
                .catch(err => {
                  alert(err.message);
                });
            } else {
              alert(`${product.name} is already in your wishlist.`);
            }
          })
          .catch(err => {
            alert(err.message);
          });
      } else {
        alert("Product not found.");
      }
    })
    .catch(err => {
      alert("Error fetching product: " + err.message);
    });
}

// Load Wishlist
function loadWishlist() {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }
  const wishlistListDiv = document.getElementById('wishlistList');
  wishlistListDiv.innerHTML = "Loading wishlist...";
  db.collection('users').doc(currentUser.uid).collection('wishlist').get()
    .then(snapshot => {
      wishlistListDiv.innerHTML = "";
      if (snapshot.empty) {
        wishlistListDiv.innerHTML = "Your wishlist is empty.";
        return;
      }
      snapshot.forEach(doc => {
        const item = doc.data();
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('wishlist-item');
        itemDiv.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}" width="100" onerror="this.src='assets/images/broken.jpg'"/>
          <br>
          ${item.name} - ₹${item.price}
          <br>
          <button onclick="removeFromWishlist('${doc.id}')">Remove</button>
        `;
        wishlistListDiv.appendChild(itemDiv);
      });
    })
    .catch(err => {
      console.error("Error loading wishlist:", err);
      wishlistListDiv.innerHTML = "Error loading wishlist.";
    });
}

// Load cart items with quantity controls
function loadCart() {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }
  const cartListDiv = document.getElementById('cartList');
  const totalPriceSpan = document.getElementById('totalPrice');
  const availableCreditsSpan = document.getElementById('availableCredits');
  const creditValueSpan = document.getElementById('creditValue');
  const useCreditsCheckbox = document.getElementById('useCredits');
  cartListDiv.innerHTML = "";
  let totalPrice = 0;

  db.collection('users').doc(currentUser.uid).get().then(userDoc => {
    const userCredits = userDoc.data().credit || 0;
    const creditPoints = Math.floor(userCredits / 100);
    availableCreditsSpan.innerText = creditPoints;
    creditValueSpan.innerText = userCredits.toFixed(2);

    db.collection('cart').doc(currentUser.uid).collection('items').get()
      .then(snapshot => {
        if (snapshot.empty) {
          cartListDiv.innerHTML = "Your cart is empty.";
          totalPriceSpan.innerText = "0";
          useCreditsCheckbox.disabled = true;
          return;
        }

        const promises = [];
        snapshot.forEach(doc => {
          const item = doc.data();
          if (!item.imageUrl && item.productId) {
            const promise = db.collection('products').doc(item.productId).get()
              .then(productDoc => {
                if (productDoc.exists) {
                  item.imageUrl = productDoc.data().imageUrl || 'assets/images/broken.jpg';
                }
                return { doc, item };
              });
            promises.push(promise);
          } else {
            item.imageUrl = item.imageUrl || 'assets/images/broken.jpg';
            promises.push(Promise.resolve({ doc, item }));
          }
        });

        return Promise.all(promises);
      })
      .then(results => {
        if (!results || results.length === 0) return;

        results.forEach(({ doc, item }) => {
          const itemTotal = item.price * item.quantity;
          totalPrice += itemTotal;
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('cart-item');
          itemDiv.innerHTML = `
            <div class="cart-item-content">
              <img src="${item.imageUrl}" alt="${item.name}" width="80" onerror="this.src='assets/images/broken.jpg'"/>
              <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="quantity-controls">
                  <button onclick="decreaseCartQuantity('${doc.id}')">-</button>
                  <span id="cart-quantity-${doc.id}">${item.quantity}</span>
                  <button onclick="increaseCartQuantity('${doc.id}')">+</button>
                </div>
                <div class="cart-item-total">Total: ₹${itemTotal}</div>
                <button class="remove-btn" onclick="removeFromCart('${doc.id}')">Remove</button>
              </div>
            </div>
          `;
          cartListDiv.appendChild(itemDiv);
        });

        totalPriceSpan.innerText = totalPrice.toFixed(2);
        useCreditsCheckbox.disabled = false;
        updateTotalWithCredits();
      })
      .catch(err => {
        console.error("Error loading cart:", err);
        cartListDiv.innerHTML = "Error loading cart.";
      });
  });
}

// Add to Cart from Wishlist
function addToCartFromWishlist(wishlistItemId) {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  db.collection('users').doc(currentUser.uid).collection('wishlist').doc(wishlistItemId).get()
    .then(doc => {
      if (doc.exists) {
        const item = doc.data();
        db.collection('cart').doc(currentUser.uid).collection('items').add({
          productId: item.id || wishlistItemId,
          name: item.name,
          price: item.price,
          credit: item.credit || 0,
          imageUrl: item.imageUrl || 'assets/images/broken.jpg',
          quantity: 1
        })
          .then(() => {
            alert(`${item.name} added to cart!`);
          })
          .catch(err => {
            console.error("Error adding to cart:", err);
            alert("Error adding item to cart.");
          });
      } else {
        alert("Wishlist item not found.");
      }
    })
    .catch(err => {
      console.error("Error fetching wishlist item:", err);
      alert("Error fetching wishlist item.");
    });
}

// Update total price with credits if checkbox is checked
function updateTotalWithCredits() {
  const useCreditsCheckbox = document.getElementById('useCredits');
  const totalPriceSpan = document.getElementById('totalPrice');
  const creditValueSpan = document.getElementById('creditValue');
  const discountAmountSpan = document.getElementById('discountAmount');
  const creditDiscountDiv = document.getElementById('creditDiscount');
  const finalTotalDiv = document.getElementById('finalTotal');
  const finalPriceSpan = document.getElementById('finalPrice');

  const totalPrice = parseFloat(totalPriceSpan.innerText);
  const availableCreditValue = parseFloat(creditValueSpan.innerText);

  if (useCreditsCheckbox.checked && availableCreditValue > 0) {
    const discount = Math.min(availableCreditValue, totalPrice);
    discountAmountSpan.innerText = discount.toFixed(2);
    creditDiscountDiv.style.display = 'block';
    finalPriceSpan.innerText = (totalPrice - discount).toFixed(2);
    finalTotalDiv.style.display = 'block';
  } else {
    creditDiscountDiv.style.display = 'none';
    finalTotalDiv.style.display = 'none';
  }
}

// Remove item from cart
function removeFromCart(itemId) {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }
  db.collection('cart').doc(currentUser.uid).collection('items').doc(itemId).delete()
    .then(() => {
      alert("Item removed from cart!");
      loadCart();
    })
    .catch(err => {
      console.error("Error removing item from cart:", err);
      alert("Error removing item from cart.");
    });
}

// Remove item from wishlist
function removeFromWishlist(itemId) {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }
  db.collection('users').doc(currentUser.uid).collection('wishlist').doc(itemId).delete()
    .then(() => {
      alert("Item removed from wishlist!");
      loadWishlist();
    })
    .catch(err => {
      console.error("Error removing item from wishlist:", err);
      alert("Error removing item from wishlist.");
    });
}

// Place an order with bill generation and credit deduction
function placeOrder() {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }
  const userCartRef = db.collection('cart').doc(currentUser.uid).collection('items');
  const userRef = db.collection('users').doc(currentUser.uid);
  const billDetailsDiv = document.getElementById('billDetails');
  const creditsEarnedSpan = document.getElementById('creditsEarned');
  const billSection = document.getElementById('billSection');
  const useCreditsCheckbox = document.getElementById('useCredits');
  const totalPriceSpan = document.getElementById('totalPrice');
  const discountAmountSpan = document.getElementById('discountAmount');

  userCartRef.get().then(snapshot => {
    let cartItems = [];
    let totalPrice = 0;
    let totalCredit = 0;

    if (snapshot.empty) {
      alert("Your cart is empty!");
      return;
    }

    snapshot.forEach(doc => {
      const item = doc.data();
      cartItems.push(item);
      totalPrice += item.price * item.quantity;
      totalCredit += item.credit * item.quantity;
    });

    let discount = 0;
    let finalAmount = totalPrice;
    if (useCreditsCheckbox.checked) {
      const availableCredits = parseFloat(document.getElementById('creditValue').innerText);
      discount = Math.min(availableCredits, totalPrice);
      finalAmount = totalPrice - discount;
    }

    generateProfessionalBill(cartItems, totalPrice, discount, finalAmount, totalCredit, billDetailsDiv, creditsEarnedSpan);

    db.collection('orders').add({
      userId: currentUser.uid,
      items: cartItems,
      totalPrice: totalPrice,
      totalCredit: totalCredit,
      creditDiscount: discount,
      finalAmount: finalAmount,
      orderDate: firebase.firestore.FieldValue.serverTimestamp(), // Use server timestamp for consistency
      status: "Delivered"
    }).then(docRef => {
      const orderId = docRef.id;

      userRef.get().then(userDoc => {
        const currentCredit = userDoc.data().credit || 0;
        const newCredit = currentCredit - discount + (totalCredit * 100);
        userRef.update({ credit: newCredit });
      });

      snapshot.forEach(doc => doc.ref.delete());

      billSection.style.display = 'block';

      alert("Order placed successfully! Check your bill below.");
      loadCart();
    }).catch(err => {
      console.error("Error placing order:", err);
      alert("Error placing order.");
    });
  }).catch(err => {
    console.error("Error fetching cart:", err);
    alert("Error processing cart.");
  });
}

// Generate professional bill
function generateProfessionalBill(items, totalPrice, discount, finalAmount, totalCredit, billDetailsDiv, creditsEarnedSpan) {
  const billContent = `
      <div class="bill-container">
          <div class="bill-header">
              <div class="company-info">
                  <h1>Digicom Shopping</h1>
                  <p>123 Digital Drive, Tech City</p>
                  <p>Phone: +1-555-555-5555</p>
                  <p>Email: support@digicom.com</p>
              </div>
              <div class="bill-details">
                  <h2>TAX INVOICE</h2>
                  <p>Invoice No: ${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}</p>
                  <p>Date: ${new Date().toLocaleDateString()}</p>
              </div>
          </div>
          
          <div class="bill-content">
              <table class="bill-table">
                  <thead>
                      <tr>
                          <th>Item Description</th>
                          <th>Quantity</th>
                          <th>Unit Price (₹)</th>
                          <th>Total (₹)</th>
                          <th>Credits</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${items.map(item => `
                          <tr>
                              <td>${item.name}</td>
                              <td>${item.quantity}</td>
                              <td>${item.price.toFixed(2)}</td>
                              <td>${(item.price * item.quantity).toFixed(2)}</td>
                              <td>${(item.credit * item.quantity).toFixed(2)}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
              
              <div class="bill-summary">
                  <div class="summary-item">
                      <span>Subtotal:</span>
                      <span>₹${totalPrice.toFixed(2)}</span>
                  </div>
                  ${discount > 0 ? `
                      <div class="summary-item">
                          <span>Credit Discount:</span>
                          <span>-₹${discount.toFixed(2)}</span>
                      </div>
                  ` : ''}
                  <div class="summary-item total">
                      <span>Total Amount:</span>
                      <span>₹${finalAmount.toFixed(2)}</span>
                  </div>
                  <div class="summary-item credits">
                      <span>Total Credits Earned:</span>
                      <span>${totalCredit.toFixed(2)}</span>
                  </div>
              </div>
          </div>
          
          <div class="bill-footer">
              <p>Thank you for shopping with Digicom Shopping!</p>
              <p>Please keep this invoice for your records.</p>
              <p>Payment Terms: Payment is due within 7 days of invoice date</p>
          </div>
      </div>
  `;

  billDetailsDiv.innerHTML = billContent;
  creditsEarnedSpan.innerText = totalCredit.toFixed(2);
}

// Print bill
function printBill() {
  const billSection = document.getElementById('billSection');
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
      <html>
          <head>
              <title>Digicom Shopping Invoice</title>
              <style>
                  @media print {
                      .print-controls { display: none; }
                      .bill-container {
                          font-family: Arial, sans-serif;
                          width: 100%;
                          max-width: 800px;
                          margin: 0 auto;
                          padding: 20px;
                      }
                      .bill-table {
                          width: 100%;
                          border-collapse: collapse;
                          margin-top: 20px;
                      }
                      .bill-table th,
                      .bill-table td {
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                      }
                      .bill-table th {
                          background-color: #f4f4f4;
                      }
                      .bill-summary {
                          margin-top: 20px;
                          padding: 15px;
                          background-color: #f9f9f9;
                          border: 1px solid #ddd;
                      }
                      .summary-item {
                          display: flex;
                          justify-content: space-between;
                          margin-bottom: 5px;
                      }
                      .summary-item.total {
                          font-weight: bold;
                          border-top: 1px solid #ddd;
                          padding-top: 10px;
                      }
                  }
              </style>
          </head>
          <body>
              ${billSection.innerHTML}
          </body>
      </html>
  `);
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
}

// Load order history with professional formatting and sorted by time
function loadHistory() {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const historyListDiv = document.getElementById('historyList');
  historyListDiv.innerHTML = '<p>Loading order history...</p>';

  db.collection('orders')
    .where('userId', '==', currentUser.uid)
    .orderBy('orderDate', 'desc') // Sort by date, newest first
    .get()
    .then(snapshot => {
      historyListDiv.innerHTML = ''; // Clear loading message

      if (snapshot.empty) {
        historyListDiv.innerHTML = '<p>No order history available.</p>';
        return;
      }

      snapshot.forEach(doc => {
        const order = doc.data();
        const orderId = doc.id;

        // Handle orderDate safely
        let orderDate;
        if (order.orderDate && order.orderDate.seconds) {
          // Firestore Timestamp
          orderDate = new Date(order.orderDate.seconds * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        } else if (order.orderDate) {
          // JavaScript Date object
          orderDate = new Date(order.orderDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        } else {
          // Fallback if orderDate is missing
          orderDate = 'Date not available';
        }

        const status = order.status || 'Delivered'; // Default status if not present

        // Create order card
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order-card');

        // Order summary section
        const orderSummary = `
          <div class="order-summary">
            <div class="order-meta">
              <span class="order-date">Ordered on: ${orderDate}</span>
              <span class="order-status ${status.toLowerCase()}">${status}</span>
            </div>
            <div class="order-details">
              <span class="order-id">Order ID: ${orderId}</span>
              <span class="order-total">Total: ₹${order.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        `;

        // Items list section
        let itemsList = '<div class="order-items">';
        order.items.forEach(item => {
          const itemTotal = item.price * item.quantity;
          const imageUrl = item.imageUrl || 'assets/images/broken.jpg';
          itemsList += `
            <div class="order-item">
              <img src="${imageUrl}" alt="${item.name}" onerror="this.src='assets/images/broken.jpg'" />
              <div class="item-details">
                <h4>${item.name}</h4>
                <p>Price: ₹${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: ₹${itemTotal.toFixed(2)}</p>
                <p>Credits Earned: ${(item.credit * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          `;
        });
        itemsList += '</div>';

        // Order totals section
        const orderTotals = `
          <div class="order-totals">
            <p>Subtotal: ₹${order.totalPrice.toFixed(2)}</p>
            ${order.creditDiscount > 0 ? `
              <p>Credit Discount: -₹${order.creditDiscount.toFixed(2)}</p>
            ` : ''}
            <p class="final-amount">Final Amount: ₹${order.finalAmount.toFixed(2)}</p>
            <p>Total Credits Earned: ${order.totalCredit.toFixed(2)}</p>
          </div>
        `;

        // Combine all sections
        orderDiv.innerHTML = orderSummary + itemsList + orderTotals;
        historyListDiv.appendChild(orderDiv);
      });
    })
    .catch(err => {
      console.error("Error loading history:", err);
      historyListDiv.innerHTML = '<p>Error loading order history. Please try again later.</p>';
    });
}

// Logout
function logout() {
  auth.signOut().then(() => {
    currentUser = null;
    alert("Logged out successfully.");
    showSection('home');
  });
}

// Monitor authentication state
auth.onAuthStateChanged(user => {
  currentUser = user;
});

// Add event listener for Wishlist section
document.addEventListener('DOMContentLoaded', () => {
  const wishlistLink = document.querySelector('.nav-link[onclick^="showSection(\'wishlist\'"]');
  if (wishlistLink) {
    wishlistLink.addEventListener('click', () => {
      loadWishlist();
    });
  }
});

function completePurchase(userId, totalAmount) {
  let creditPoints = Math.floor(totalAmount / 10);

  let userRef = firebase.firestore().collection("users").doc(userId);
  userRef.get().then(doc => {
    let currentCredits = doc.data().credits || 0;
    userRef.update({ credits: currentCredits + creditPoints })
      .then(() => alert("Purchase successful! Credits updated."))
      .catch(error => console.error("Error updating credits:", error));
  });
}