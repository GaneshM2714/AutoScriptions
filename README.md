
# 🧠 AutoScriptions – Intelligent Subscription Management Platform

AutoScriptions is a comprehensive subscription tracking and management application that helps users monitor, analyze, and optimize their recurring payments. Built with modern web technologies and designed specifically for the Indian market.

---

## 🚀 Features

### Core Functionality
- **Smart Subscription Tracking**: Add, edit, and delete subscriptions with detailed information.
- **Dashboard Analytics**: Visual overview of spending patterns and subscription metrics.
- **Category Management**: Organize subscriptions by type (Entertainment, Music, Productivity, etc.).
- **Renewal Alerts**: Never miss a payment with intelligent reminder system.
- **Multi-view Display**: Toggle between table and grid views for better data visualization.

---

## 📁 Project Structure
```bash
AutoScriptions/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ProfileSettings.jsx
│   │   ├── pages/
│   │   │   ├── Homepage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Subscriptions.jsx
│   │   │   └── Preferences.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── Backend/
│   ├── models/
│   │   ├── user.js
│   │   └── subscriptions.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── subscriptionController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   └── server.js
└── README.md
```


---

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/GaneshM2714/AutoScriptions.git
cd AutoScriptions
```

#### 2. Backend Setup
```bash
cd Backend
npm install

# Create .env file with your configuration
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your_jwt_secret_key" >> .env

# Start the backend server
npm start
```
#### 3. Frontend Setup
```bash
cd ../Frontend
npm install

# Start the development server
npm run dev
```
#### 4. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000


## 📊 API Endpoints

### 🔐 Authentication
- `POST /users/register` – User registration  
- `POST /users/login` – User login  
- `POST /users/logout` – User logout  
- `GET /users/profile` – Get user profile  
- `PUT /users/profile` – Update user profile  

### 📄 Subscriptions
- `GET /subscriptions` – Get all user subscriptions  
- `POST /subscriptions` – Create a new subscription  
- `PUT /subscriptions/:id` – Update a subscription  
- `DELETE /subscriptions/:id` – Delete a subscription  

### ⚙️ Preferences
- `GET /users/preferences` – Get user preferences  
- `PUT /users/preferences` – Update user preferences  

---

## 🎨 User Interface

The application features a modern, responsive design with:
- **Clean Dashboard**: Overview of subscription metrics and quick actions.
- **Interactive Tables**: Sortable columns with search functionality.
- **Responsive Cards**: Mobile-friendly grid view for subscriptions.
- **Intuitive Navigation**: Seamless routing between different sections.
- **Smart Forms**: Validation and error handling for data entry.

---

## 🔒 Security Features

- **Password Encryption**: bcrypt hashing for secure password storage.
- **JWT Authentication**: Stateless token-based authentication.
- **CORS Protection**: Cross-origin request security.
- **Data Validation**: Input sanitization and validation.
- **Private Routes**: Protected endpoints requiring authentication.

---

## 🌟 Future Roadmap

### Phase 1: Enhanced Analytics
- Interactive charts and graphs  
- Spending trend analysis  
- Category-wise breakdowns  
- Export and reporting features  

### Phase 2: AI Integration
- Machine learning spending predictions  
- Anomaly detection for unusual charges  
- Personalized recommendations  
- Natural language insights  

### Phase 3: Banking Integration
- Account Aggregator framework implementation  
- Automatic subscription detection  
- Bank statement analysis  
- Real-time transaction monitoring  

### Phase 4: Advanced Features
- Multi-currency support  
- Family subscription sharing  
- Budget management tools  
- Mobile application  

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the project  
2. Create your feature branch: `git checkout -b feature/AmazingFeature`  
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`  
4. Push to the branch: `git push origin feature/AmazingFeature`  
5. Open a Pull Request  

For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

This project is licensed under the MIT License – see the LICENSE file for details.

---

## 👨‍💻 Author

**Ganesh M**  
GitHub: [@GaneshM2714](https://github.com/GaneshM2714)

---

## 🙏 Acknowledgments

- Built with passion to help users manage their subscription expenses.
- Inspired by the need for better financial awareness in the digital age.
- Thanks to the open-source community for amazing tools and libraries.


AutoScriptions - Taking control of your subscriptions, one insight at a time! 🎯

[1] https://github.com/GaneshM2714/AutoScriptions