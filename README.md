# Queue Management System 🧾

A full-stack **Queue Management System** designed for businesses to efficiently manage customer queues, assign tokens, reorder customers, and track real-time analytics. Built with a modern web technology stack using React, Node.js, Express, and MongoDB.

---

## 🚀 Features

1. **Authentication & Role-Based Access**
   - Manager login system with secured routing.

2. **Queue Creation and Listing**
   - Managers can create new queues.
   - View all queues with real-time token updates.

3. **Token Assignment and Management**
   - Add customers as tokens in queues.
   - Reorder, cancel, or assign tokens for service.

4. **Live Queue Dashboard**
   - Track wait times, number of customers, active vs. served tokens.
   - Visual charts using `recharts` for queue trends and analytics.

5. **Interactive UI**
   - React-based UI with clean design.
   - Responsive and dynamic with real-time updates.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** (with hooks)
- **Axios** for API calls
- **Recharts** for data visualization
- **CSS** for styling (no external UI frameworks used)

### **Backend**
- **Node.js** with **Express.js**
- RESTful API architecture
- Environment-based configuration (`dotenv`)
- Controllers & route separation for scalability

### **Database**
- **MongoDB** with **Mongoose** ODM
- Schema models for User, Manager, Queue, and Token

### **Hosting Options** (Ready to Deploy)
- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas

---

## 📁 Project Structure

queue-management-app/
│
├── client/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Pages (Login, Dashboard, Queues, etc.)
│ │ └── styles/ # CSS styles
│ └── package.json
│
├── server/ # Express backend
│ ├── controllers/ # Business logic (analytics, queue, token)
│ ├── models/ # Mongoose models
│ ├── routes/ # API route definitions
│ ├── config/ # DB connection, middleware, etc.
│ └── server.js # Main backend entry point
│
├── .gitignore
├── README.md
└── package.json

yaml
Copy
Edit


---

## 📊 Dashboard Features

- Average wait time per queue
- Number of tokens generated, served, and canceled
- Line and Bar charts of queue trends
- Realtime data synced with MongoDB

---

## 📦 Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/rakeshhc22/queue-management-system.git
cd queue-management-system

**
### 2. Setup the Backend**

cd server
npm install
# Add your MongoDB URI to a `.env` file
npm start



### 3. Setup the Frontend

cd client
npm install
npm start


👨‍💻 Author
Rakesh Chandru
BE Student @ Malnad College of Engineering
GitHub: @rakeshhc22


📃 License
This project is open-source and available under the MIT License.

yaml
Copy
Edit

---

Would you like me to:
- Create this file and push it to your repo via Git commands?
- Or help you write a shorter version for LinkedIn?

Let me know what you'd like to do next — we can move to **hosting** if this is good to go!





