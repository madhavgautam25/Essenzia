# 🌸 Essenzia - Luxury Perfume E-commerce Website

Essenzia is a full-stack, economical Direct-to-Consumer (D2C) e-commerce platform for luxury perfumes, inspired by the elegance of Uamore. It offers a clean, modern design and seamless shopping experience.

## ✨ Features
- Responsive frontend built with **HTML, CSS, JavaScript**
- Backend API using **Node.js + Express**
- **MongoDB (via Mongoose)** for data persistence
- Product browsing, filtering, and detail views
- Add/remove/view items in the shopping cart
- Secure user **authentication (JWT-based)**
- **Order checkout** with dummy payment flow
- Admin support for CRUD operations on products

## 🛒 Pages
- `index.html` — Homepage with featured products
- `product.html` — Product listings
- `product-detail.html` — Single product view
- `cart.html` — View and manage cart
- `checkout.html` — Final order submission
- `login.html` / `register.html` — User auth
- `contact.html` — Simple form for user queries

## 🧱 Tech Stack
| Layer        | Tech                     |
|--------------|--------------------------|
| Frontend     | HTML, CSS, JavaScript    |
| Backend      | Node.js, Express         |
| Database     | MongoDB + Mongoose       |
| Auth         | JWT, bcrypt              |

## 📁 Project Structure
```
├── client
│   ├── index.html
│   ├── ... (other HTML pages)
│   ├── css/styles.css
│   └── js/
├── server
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── .env
```

## ⚙️ Installation & Setup
### 1. Backend
```bash
cd server
npm install
# create .env file:
# MONGODB_URI=mongodb://localhost:27017/essenzia
# JWT_SECRET=your_secret_key
node server.js
```

### 2. Frontend
Open `client/index.html` in browser or use a live server plugin.

## 🧪 Testing
Use browser to:
- Register/login users
- Add items to cart
- Place orders


## 🚀 Deployment Suggestions
- **Frontend:** Netlify / Vercel / GitHub Pages
- **Backend:** Render / Cyclic / Railway
- **Database:** MongoDB Atlas

## 📌 Credits
Developed by Madhav Gautam as a submission for Uamore D2C Web Dev Challenge.

---
Let elegance meet code — with Essenzia. 🌹
