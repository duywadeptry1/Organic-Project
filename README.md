# 🛒 Organi - E-Commerce Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> A modern, full-stack E-Commerce application specializing in organic foods. Built from the ground up using the MERN stack and Redux Toolkit.

This project is developed as the final coursework for **"Đồ án cơ sở kỹ thuật CNTT"** at **Nguyen Tat Thanh University (NTTU)**.

---

## ✨ Key Features

* **User Authentication:** Secure login and registration using JSON Web Tokens (JWT) and HTTP-only cookies. Passwords are encrypted using `bcryptjs`.
* **Product Catalog:** Browse products, view detailed specifications, and check real-time stock availability.
* **Smart Shopping Cart:** Global cart state managed by **Redux Toolkit**. Cart data is persistently synced with the browser's `LocalStorage` so users never lose their items upon refresh.
* **Checkout Pipeline:** A seamless, multi-step checkout process (Shipping -> Payment Method -> Place Order).
* **Responsive UI:** Fully responsive design built with Tailwind CSS and DaisyUI, ensuring a perfect experience on both mobile and desktop.
* **Optimized API Calls:** Leveraging **RTK Query** for intelligent data fetching, caching, and minimizing redundant network requests.

---

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** React.js (Bootstrapped with Vite for lightning-fast HMR)
* **State Management:** Redux Toolkit & RTK Query
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS & DaisyUI

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose ODM
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** bcryptjs (Password Hashing)
---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
* [Node.js](https://nodejs.org/en/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Cloud)

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/organi-ecommerce.git](https://github.com/your-username/organi-ecommerce.git)
cd organi-ecommerce
```
### 2. Environment Setup
Create a .env file in the organi-sever (backend) directory and add the following 
variables:
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
### 3. Install Dependencies & Run
For the Backend (Server):
Open a terminal and run:
```bash
cd organi-server
npm install
npm run dev
```
The server will start on http://localhost:5000

For the Frontend (Client):
Open a second terminal and run:
```bash
cd organi-client
npm install
npm run dev
```
The React app will start on http://localhost:5173
### 📂 Project Structure
```bash
organi-ecommerce/
│
├── organi-server/          # Backend Node/Express API
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   ├── routes/             # API routes definition
│   └── middlewares/        # Custom middlewares (Auth, Error handling)
│
└── organi-client/          # Frontend React App
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Main application views
    │   ├── slices/         # Redux Toolkit Slices & RTK Query APIs
    │   └── store.js        # Global Redux Store configuration
```
### 👨‍💻 About the Author
Phạm Minh Duy

Student at Nguyen Tat Thanh University

Major: Information Technology

GitHub: https://github.com/duywadeptry1/OrganicProduct

Contact: https://www.facebook.com/Dyneahihi612

Special thanks to the IT Faculty at NTTU and my instructor for guiding me through this project.
