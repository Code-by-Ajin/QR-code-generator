# 🔐 QR Steganography

> Hide secret messages and images behind a password-protected QR Code. Anyone can scan it, but only those with the password can read it.

![QR Steganography Banner](https://img.shields.io/badge/QR-Steganography-blue?style=for-the-badge&logo=qrcode)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb)
![Render](https://img.shields.io/badge/Deployed-Render.com-purple?style=for-the-badge)

---

## ✨ Features

- 📝 **Hide text messages** behind a QR code
- 🖼️ **Hide images** (up to 10MB) behind a QR code
- 🔒 **Password protection** — only the right password reveals the content
- 📱 **Scan from any phone** — works globally, no same Wi-Fi required
- 💾 **Save QR code** as a PNG image
- 🔗 **Share link** — copy the secret URL to clipboard
- 🗑️ **Auto-delete** — messages expire automatically after 7 days
- 🌙 **Dark glassmorphism UI** — beautiful premium design

---

## 🚀 Live Demo

👉 **[https://qr-steganography.onrender.com](https://qr-steganography.onrender.com)**

> ⚠️ Free tier may take ~30 seconds to wake up on first visit.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router, Axios, qrcode.react, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (images stored as Base64) |
| **Auth** | bcryptjs (password hashing) |
| **Hosting** | Render.com (free tier) |

---

## 📁 Project Structure

```
qr-steganography/
├── backend/
│   ├── models/
│   │   └── Message.js        # MongoDB schema
│   ├── routes/
│   │   └── messageRoutes.js  # API endpoints
│   ├── server.js             # Express server + serves React build
│   ├── package.json
│   └── .env                  # (not committed — add on Render)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateMessage.js  # QR Code creator page
│   │   │   └── ViewMessage.js    # Password unlock page
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── render.yaml               # Render.com deployment config
└── .gitignore
```

---

## ⚙️ How It Works

```
1. User enters a secret message / image + sets a password
        ↓
2. Backend hashes the password with bcrypt and stores
   the message + image (Base64) in MongoDB Atlas
        ↓
3. Backend returns a unique message ID
        ↓
4. Frontend generates a QR Code containing the public URL:
   https://your-app.onrender.com/view/<message-id>
        ↓
5. Anyone scans the QR Code → lands on the unlock page
        ↓
6. They enter the password → backend verifies with bcrypt
        ↓
7. ✅ Correct password → message/image is revealed
   ❌ Wrong password → access denied
```

---

## 🖥️ Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/Code-by-Ajin/QR-code-generator.git
cd QR-code-generator
```

### 2. Setup backend
```bash
cd backend
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

Install dependencies:
```bash
npm install
```

### 3. Build the frontend
```bash
cd ../frontend
npm install
npm run build
```

### 4. Start the server
```bash
cd ../backend
npm start
```

Visit: **http://localhost:5000**

The backend serves the React app directly, so you only need to run one server.

---

## 🌐 Deploy to Render.com

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo and set:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

4. Add environment variable:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `NODE_ENV` = `production`

5. In MongoDB Atlas → Network Access → **Allow from anywhere** (`0.0.0.0/0`)

---

## 🔌 API Endpoints

### `POST /api/message`
Create a new secret message.

**Body (multipart/form-data):**
| Field | Type | Description |
|---|---|---|
| `text` | string | Secret text (optional) |
| `image` | file | Secret image max 10MB (optional) |
| `password` | string | Password to lock the message |

**Response:**
```json
{ "id": "64f3a2b1c9e8d7f6e5d4c3b2" }
```

---

### `POST /api/message/:id`
Retrieve a secret message with the correct password.

**Body (JSON):**
```json
{ "password": "your-password" }
```

**Response:**
```json
{
  "text": "Your secret message",
  "imageUrl": "data:image/jpeg;base64,..."
}
```

---

## 🔒 Security

- Passwords are **never stored in plain text** — bcrypt hashing with salt rounds
- Messages **auto-expire after 7 days** via MongoDB TTL index
- Images stored as **Base64 in MongoDB** — no filesystem exposure
- CORS enabled for all origins (suitable for public API)

---

## 📸 Screenshots

| Create Message | QR Code Generated | Unlock Message |
|---|---|---|
| Enter your secret text/image and set a password | Scan the QR code with any phone | Enter password to reveal the secret |

---


---

## 👨‍💻 Author

**Ajin** — [@Code-by-Ajin](https://github.com/Code-by-Ajin)

---

⭐ If you found this useful, please give it a star on GitHub!
