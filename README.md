# 🌍 GlobeTreker – Full-Stack Travel Campground App

🌍 Overview

GlobeTreker is a full-stack travel campground application 🏕️✨ that allows users to:

🌐 Explore campgrounds around the world

➕ Create and manage their own listings

⭐ Review and rate campgrounds

It is built using the MERN-style stack ⚡ (MongoDB, Express, Node.js) and leverages EJS, HTML, and CSS 🎨 for dynamic and responsive front-end rendering.

---

## ✨ Features

* 🔑 **Authentication & Authorization**

  * Secure user registration and login
  * Session-based authentication with Passport.js
  * Authorization checks (only owners can edit/delete their listings)

* 🏕️ **Campground Listings**

  * Add new campgrounds with details (name, location, price, description)
  * Edit & delete listings (restricted to owners)
  * Browse campgrounds created by other users

* 🖼️ **Image Uploads**

  * Upload campground images
  * Store image URLs with listings

* ⭐ **Reviews & Ratings**

  * Add reviews for campgrounds
  * Edit & delete own reviews
  * Average rating system

* 🌍 **Responsive UI**

  * Clean, user-friendly design with Bootstrap
  * Dynamic rendering using EJS templates

---

## 🛠️ Tech Stack

* **Frontend:** EJS, HTML5, CSS3, Bootstrap
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** Passport.js, Express-Session
* **Other Tools:** Method-Override, Dotenv

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/) (local or Atlas)
* npm (comes with Node.js)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/PRASHANTKUMAR-7/GlobeTreker.git
   cd GlobeTreker
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add:

   ```env
   MONGO_URI=your_mongodb_connection_string
   SECRET=your_session_secret
   PORT=3000
   ```

4. Start the application

   ```bash
   npm start
   ```

   The app will run on [http://localhost:3000](http://localhost:3000) 🌐

---

## 📸 Screenshots
SignIn
<img width="1905" height="954" alt="image" src="https://github.com/user-attachments/assets/0db0d1ce-8625-4448-894b-b512a88b6403" />
Login
<img width="1915" height="951" alt="image" src="https://github.com/user-attachments/assets/ea36317b-d63c-4898-833f-e203b193d07a" />
All Elements
<img width="1890" height="951" alt="image" src="https://github.com/user-attachments/assets/0f7d14ef-a23b-4431-a3f9-63de20773b48" />
Show Element
<img width="1881" height="954" alt="image" src="https://github.com/user-attachments/assets/99aa1409-469c-4920-ba7e-fa6c1495fc67" />
Reviews
<img width="1888" height="951" alt="image" src="https://github.com/user-attachments/assets/71f9abf8-c445-491c-ba76-2ec007d0198f" />


---

## 📌 Future Improvements

* 🔍 Search and filter campgrounds by location
* 📍 Integration with Google Maps API
* 📱 Progressive Web App (PWA) support
* 🌟 Add social login (Google/GitHub OAuth)

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License** – feel free to use and modify it.


