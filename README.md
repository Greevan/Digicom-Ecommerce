# Introduction

# E-Commerce Application

Welcome to the E-Commerce Application, a web-based platform built using HTML, CSS, JavaScript, and Firebase for managing products, carts, orders, and user interactions. This project provides a seamless shopping experience for users and a robust admin interface for store management.


GIT REPO LINK : https://github.com/Greevan/Digicom-Ecommerce.git

HOSTED LINK : [Digicom - shopping](https://greevan.github.io/Digicom-Ecommerce/)
ADMIN LOGIN CREDENTIALS : USERNAME : admin@g.com PASSWORD : admin123

## Table of Contents

* [Overview](#overview)
* [Features](#features)
  * [User Features](#user-features)
  * [Admin Features](#admin-features)
* [Setup Instructions](#setup-instructions)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [Technologies Used](#technologies-used)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## Overview

This e-commerce application allows users to browse products, add items to their cart, place orders, and track their order history. It integrates Firebase for authentication, real-time database management, and storage. The admin panel, accessible only to the designated admin (**admin@g.com**), provides tools for managing products, generating reports, and overseeing store operations.

## Features

### User Features

* **User Authentication**: Login and signup functionality with role-based access (user and admin).
* **Product Browsing**: View a grid of products with details (name, price, description, stock).
* **Search and Filtering**: Search products by name or description, and filter by subcategory (e.g., Electronics).
* **Cart Management**: Add products to the cart, adjust quantities, and remove items. Supports quantity controls with stock validation.
* **Order Placement**: Place orders with credit-based discounts and generate professional invoices.
* **Order History**: View past orders in a horizontal card layout with details (items, totals, credits earned).
* **Wishlist**: Add and remove products from a wishlist.
* **Notifications**: In-app notifications for actions like adding to cart or stock warnings.
* **Pagination**: Display 12 products per page with "Previous" and "Next" navigation.
* **Responsive Design**: Basic responsiveness for different screen sizes.

### Admin Features

* **Admin Authentication**: Restricted login for the admin (**admin@g.com**).
* **Product Management**:
  * **Add Products**: Add new products with fields (name, price, credit, image URL, description, subcategory, quantity, disabled status).
  * **View Products**: List all products with edit and delete options.
  * **Edit Products**: Update existing product details.
  * **Delete Products**: Remove products with confirmation.
* **Report Section**:
  * Generate statistical overviews including total sales, number of orders, popular products, and user credit usage.
  * Display reports in a dynamic interface for administrative review.
* **Access Control**: Ensures only the authorized admin can access the panel.

## Setup Instructions

### Prerequisites

* Node.js (optional, for local development tools)
* A Firebase account and project setup
* Web browser (Chrome, Firefox, etc.)

### Installation

1. **Clone the Repository**:
   **bash**

   **Collapse**Wrap**Copy**

   `<span>git </span><span>clone</span><span> https://github.com/your-username/e-commerce-app.git </span><span></span><span>cd</span><span> e-commerce-app</span>`
2. **Set Up Firebase**:

   * Create a Firebase project on the [Firebase Console](https://console.firebase.google.com/).
   * Enable Authentication (Email/Password provider).
   * Set up Firestore Database and Storage.
   * Copy your Firebase configuration object (found in Project Settings > General) and replace the **firebaseConfig** object in **admin.js**.
3. **Configure Firestore Collections**:

   * Create the following collections:
     * **products**: Store product details (e.g., name, price, quantity, credit, description, imageUrl, subCategory, disabled).
     * **users**: Store user data (e.g., email, credit).
     * **cart**: Nested collection under each user document for cart items.
     * **orders**: Store order details (e.g., userId, items, totalPrice, creditDiscount, finalAmount, orderDate, status).
     * **wishlist**: Nested collection under each user document for wishlist items.
   * Populate the **products** collection with initial data.
4. **Run the Application**:

   * Serve the project locally using a static server (e.g., **npx serve** or a local web server).
   * Open **index.html** for user access or **admin.html** for admin access, or deploy to a hosting service (e.g., Firebase Hosting).

## Usage

1. **User Access**:
   * Open **index.html** to log in or sign up.
   * Browse products, manage cart, place orders, and view history.
2. **Admin Access**:
   * Open **admin.html** and log in with **admin@g.com** and the corresponding password.
   * Navigate the dashboard to add, view, edit, or delete products.
   * Access the report section to view sales and usage statistics.
   * Log out to return to the login page.

## Project Structure

**text**

**Collapse**Wrap**Copy**

`<span>e-commerce-app/ </span>├── index.html          # Main HTML file for user interface ├── app.js             # JavaScript logic for user features ├── admin.html         # Admin interface HTML ├── admin.js           # JavaScript logic for admin features ├── css/               # CSS files (style.css, admin.css) │   ├── style.css      # General styling │   └── admin.css      # Admin-specific styling ├── assets/            # Folder for images (e.g., broken.jpg) └── README.md          # This file`

## Technologies Used

* **HTML5**: Structure of the web pages.
* **CSS3**: Styling and responsive design.
* **JavaScript**: Client-side logic and interactivity.
* **Firebase**: Authentication, Firestore Database, and Storage.
* **Firestore**: Real-time database for products, users, carts, orders, and wishlist.
* **Google Fonts**: Poppins font for typography.

## Contributing

1. Fork the repository.
2. Create a new branch (**git checkout -b feature-branch**).
3. Make your changes and commit them (**git commit -m "Add new feature"**).
4. Push to the branch (**git push origin feature-branch**).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the **LICENSE** file for details (if not present, add one with your preferred license).

Below is a comprehensive **README.md** file for your e-commerce project. This file includes an overview, setup instructions, features (both user-facing and admin-specific), usage guidelines, and contribution details. Since you mentioned the admin page but didn’t provide specific details about its implementation, I’ve made reasonable assumptions based on a typical admin interface for an e-commerce application (e.g., product management, order management, user management). If your admin page has specific features, feel free to share them, and I can update the README accordingly.

---

# E-Commerce Application

Welcome to the E-Commerce Application, a web-based platform built using HTML, CSS, JavaScript, and Firebase for managing products, carts, orders, and user interactions. This project provides a seamless shopping experience for users and an admin interface for managing the store.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
  * [User Features](#user-features)
  * [Admin Features](#admin-features)
* [Setup Instructions](#setup-instructions)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [Technologies Used](#technologies-used)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## Overview

This e-commerce application allows users to browse products, add items to their cart, place orders, and track their order history. It integrates Firebase for authentication, real-time database management, and storage. The admin page provides tools for managing products, orders, and users, ensuring efficient store operations.

## Features

### User Features

* **User Authentication**: Login and signup functionality with role-based access (user and admin).
* **Product Browsing**: View a grid of products with details (name, price, description, stock).
* **Search and Filtering**: Search products by name or description, and filter by subcategory (e.g., Electronics).
* **Cart Management**: Add products to the cart, adjust quantities, and remove items. Supports quantity controls with stock validation.
* **Order Placement**: Place orders with credit-based discounts and generate professional invoices.
* **Order History**: View past orders in a horizontal card layout with details (items, totals, credits earned).
* **Wishlist**: Add and remove products from a wishlist.
* **Notifications**: In-app notifications for actions like adding to cart or stock warnings.
* **Pagination**: Display 12 products per page with "Previous" and "Next" navigation.
* **Responsive Design**: Basic responsiveness for different screen sizes.

### Admin Features

* **Product Management**:
  * Add new products with fields (name, price, quantity, credit, description, image URL, subcategory, disabled status).
  * Edit existing product details.
  * Delete products from the inventory.
  * Enable/disable products to control availability.
* **Order Management**:
  * View all user orders with details (order ID, date, items, totals, status).
  * Update order status (e.g., Delivered, Processing, Shipped).
  * Delete orders if needed.
* **User Management**:
  * View a list of registered users.
  * Manage user credits (e.g., manually adjust credit balances).
  * Disable or remove user accounts if necessary.
* **Analytics Dashboard**:
  * View sales statistics (total orders, revenue, popular products).
  * Monitor user activity and credit usage.
* **Access Control**: Restricted access to admin features, only available to the designated admin email (e.g., **admin@g.com**).

## Setup Instructions

### Prerequisites

* Node.js (optional, for local development tools)
* A Firebase account and project setup
* Web browser (Chrome, Firefox, etc.)

### Installation

1. **Clone the Repository**:
   **bash**

   **Collapse**Wrap**Copy**

   `<span>git </span><span>clone</span><span> https://github.com/your-username/e-commerce-app.git </span><span></span><span>cd</span><span> e-commerce-app</span>`
2. **Set Up Firebase**:

   * Create a Firebase project on the [Firebase Console](https://console.firebase.google.com/).
   * Enable Authentication (Email/Password provider).
   * Set up Firestore Database and Storage.
   * Copy your Firebase configuration object (found in Project Settings > General) and replace the **firebaseConfig** object in **app.js**.
3. **Configure Firestore Collections**:

   * Create the following collections:
     * **products**: Store product details (e.g., name, price, quantity, credit, description, imageUrl1, subCategory, disabled).
     * **users**: Store user data (e.g., email, credit).
     * **cart**: Nested collection under each user document for cart items.
     * **orders**: Store order details (e.g., userId, items, totalPrice, creditDiscount, finalAmount, orderDate, status).
     * **wishlist**: Nested collection under each user document for wishlist items.
   * Populate the **products** collection with initial data (e.g., the Logitech K400 Plus example).
4. **Run the Application**:

   * Serve the project locally using a static server (e.g., **npx serve** or a local web server).
   * Open **index.html** in a browser or deploy to a hosting service (e.g., Firebase Hosting).

## Usage

1. **Login/Signup**:
   * Navigate to the login page and sign in with an existing account or sign up for a new one.
   * Admin access is restricted to the email **admin@g.com**.
2. **Browse Products**:
   * Click "Products" to view the product list.
   * Use the search bar to find specific items or the subcategory dropdown to filter.
3. **Manage Cart**:
   * Click "Add to Cart" on a product, adjust the quantity, and confirm.
   * View and modify the cart under the "Cart" section.
   * Place an order and view the generated bill.
4. **View History and Wishlist**:
   * Check past orders in the "History" section.
   * Manage your wishlist under the "Wishlist" section.
5. **Admin Actions**:
   * Log in with **admin@g.com** and navigate to **admin.html** (if implemented separately).
   * Manage products, orders, and users through the admin interface.

## Project Structure

**text**

**Collapse**Wrap**Copy**

`<span>e-commerce-app/ </span>├── index.html          # Main HTML file with user interface ├── app.js             # JavaScript logic for user features ├── admin.html         # Admin interface (assumed separate file) ├── admin.js           # JavaScript logic for admin features (assumed) ├── style.css          # CSS for styling ├── assets/            # Folder for images (e.g., broken.jpg) └── README.md          # This file`

## Technologies Used

* **HTML5**: Structure of the web pages.
* **CSS3**: Styling and responsive design.
* **JavaScript**: Client-side logic and interactivity.
* **Firebase**: Authentication, Firestore Database, and Storage.
* **Firestore**: Real-time database for products, users, carts, orders, and wishlist.

## Contributing

1. Fork the repository.
2. Create a new branch (**git checkout -b feature-branch**).
3. Make your changes and commit them (**git commit -m "Add new feature"**).
4. Push to the branch (**git push origin feature-branch**).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the **LICENSE** file for details (if not present, add one with your preferred license).

## Contact

* **Author**: [Your Name]
* **Email**: [Your Email]
* **GitHub**: [Your GitHub Profile]

- ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
