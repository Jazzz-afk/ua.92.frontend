/* -------------------------- */
/* Carousel Functions         */
/* -------------------------- */
function prevSlide(button) {
  // Get the parent carousel container
  const carousel = button.parentElement;
  // Select all carousel items in the container
  const items = carousel.querySelectorAll('.carousel-item');
  // Find the index of the currently active item
  let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
  // Remove the active class from the current item
  items[activeIndex].classList.remove('active');
  // Calculate the previous item's index
  activeIndex = (activeIndex - 1 + items.length) % items.length;
  // Add active class to the new item
  items[activeIndex].classList.add('active');
}

function nextSlide(button) {
  // Get the parent carousel container
  const carousel = button.parentElement;
  // Select all carousel items in the container
  const items = carousel.querySelectorAll('.carousel-item');
  // Find the index of the currently active item
  let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
  // Remove the active class from the current item
  items[activeIndex].classList.remove('active');
  // Calculate the next item's index
  activeIndex = (activeIndex + 1) % items.length;
  // Add active class to the new item
  items[activeIndex].classList.add('active');
}

/* -------------------------- */
/* Responsive Navbar Toggle   */
/* -------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  // Select the hamburger element
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    // Add click event listener to toggle nav links visibility
    hamburger.addEventListener('click', function () {
      document.querySelector('.navbar').classList.toggle('active');
    });
  }
});

/* -------------------------- */
/* Back to Top Button         */
/* -------------------------- */
function scrollToTop() {
  // Scroll smoothly to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function () {
  // Get the Back to Top button element
  const backToTop = document.getElementById('backToTop');
  // Show button if scrolled more than 300px, otherwise hide it
  if (window.scrollY > 300) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});

/* -------------------------- */
/* Cart Functions using localStorage  */
/* -------------------------- */
function getCart() {
  // Retrieve the cart from localStorage; return empty array if not present
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  // Save the cart array to localStorage as a JSON string
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  // Get current cart, add new product, then save updated cart
  let cart = getCart();
  cart.push(product);
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  // Update the cart counter in the navbar based on current cart length
  const cart = getCart();
  const countElem = document.getElementById('cartCount');
  if (countElem) {
    countElem.textContent = cart.length;
  }
}

function removeFromCart(index) {
  // Remove product from cart at given index, update and re-render cart items
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  renderCartItems();
}

function renderCartItems() {
  // Render cart items and calculate total price
  const cart = getCart();
  const cartItemsElem = document.getElementById('cartItems');
  const cartTotalElem = document.getElementById('cartTotal');
  if (cartItemsElem) {
    cartItemsElem.innerHTML = '';
    let total = 0;
    cart.forEach((item, i) => {
      total += item.price;
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="price">£${item.price.toFixed(2)}</p>
        </div>
        <button onclick="removeFromCart(${i})" class="btn">Remove</button>
      `;
      cartItemsElem.appendChild(itemDiv);
    });
    if (cartTotalElem) {
      cartTotalElem.innerHTML = `
        <h3>Total: £${total.toFixed(2)}</h3>
        <button class="checkout-btn" onclick="alert('Checkout not implemented')">Proceed to Checkout</button>
      `;
    }
  }
}

/* Update cart count and render cart items on page load */
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  if (document.getElementById('cartItems')) {
    renderCartItems();
  }
});

/* -------------------------- */
/* Buy Now & Add to Cart Events  */
/* -------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  // For each Buy Now button: add product and redirect to cart page
  const buyNowButtons = document.querySelectorAll('a.buy-now');
  buyNowButtons.forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const product = {
        name: button.getAttribute('data-product-name'),
        price: parseFloat(button.getAttribute('data-product-price'))
      };
      addToCart(product);
      window.location.href = 'cart.html';
    });
  });
  
  // For each Add to Cart button: add product and show confirmation alert
  const addToCartButtons = document.querySelectorAll('a.add-to-cart');
  addToCartButtons.forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const product = {
        name: button.getAttribute('data-product-name'),
        price: parseFloat(button.getAttribute('data-product-price'))
      };
      addToCart(product);
      alert(product.name + ' has been added to your cart.');
    });
  });
});

/* -------------------------- */
/* Contact Form Validation & Rate Limiting  */
/* -------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  // Select the contact form element if it exists
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Validate phone number: must be in international format
      const phoneInput = document.getElementById('phone');
      const phoneValue = phoneInput.value.trim();
      const phonePattern = /^\+\d{6,15}$/;
      if (phoneValue && !phonePattern.test(phoneValue)) {
        alert('Please enter a valid international phone number (e.g. +441234567890).');
        return;
      }
      // Rate limiting: maximum 5 submissions per 24 hours
      const now = Date.now();
      const submissionData = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      const recentSubmissions = submissionData.filter(ts => now - ts < 24 * 60 * 60 * 1000);
      if (recentSubmissions.length >= 5) {
        const nextAvailable = new Date(recentSubmissions[0] + 24 * 60 * 60 * 1000);
        alert('You have reached the maximum number of enquiries for today. Next enquiry available at: ' + nextAvailable.toLocaleString());
        return;
      }
      // Add current submission timestamp and save
      recentSubmissions.push(now);
      localStorage.setItem('contactSubmissions', JSON.stringify(recentSubmissions));
      alert('Thank you for your enquiry. We will get back to you soon.');
      contactForm.reset();
    });
  }
});
