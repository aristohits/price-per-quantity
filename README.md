# ⚖️ Price Per Quantity Comparison

A simple and efficient Progressive Web App (PWA) to help you find the best value for your money. Quickly compare unit prices across multiple products to make smarter purchasing decisions.

## ✨ Features

- **Compare Unlimited Products:** Add multiple items (Product A, B, C, etc.) to compare up to 26 products at once.
- **Built-in Calculator:** Integrated calculator module for each input field to handle quick math before entering prices or quantities.
- **PWA Support:** Install it on your mobile device or desktop. Works offline once cached.
- **Modern UI:** Built with Tailwind CSS, featuring a sleek dark mode and fully responsive design.
- **Haptic Feedback:** Provides tactile vibration feedback for button presses and errors (on supported devices).
- **Privacy Focused:** 100% client-side calculation. No data is ever sent to a server.

## 🚀 Getting Started

### In the Browser
Simply open `index.html` in any modern web browser.

### Install as a PWA
1. Open the app in your mobile browser (Chrome or Safari).
2. Select "Add to Home Screen" from your browser menu.
3. The app icon will appear on your home screen, ready to use even without an internet connection.

## 🛠 Development & Testing

This project uses **Vitest** and **JSDOM** for unit testing to ensure the accuracy of comparison and calculator logic.

### Prerequisites
- [Node.js](https://nodejs.org/) (latest version)

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
npm test
```

## 📂 Project Structure

- `index.html`: Main UI and structure.
- `app.js`: Application logic, DOM manipulation, and calculator functionality.
- `sw.js`: Service Worker for offline capabilities.
- `manifest.json`: PWA configuration and icons.
- `app.test.js`: Unit tests for the application logic.

## 📄 License

This project is open-source and created for educational and utility purposes.
