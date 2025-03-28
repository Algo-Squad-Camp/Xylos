# React Chatbot with Dark/Light Theme and Gemini API

This project is a single-page application chatbot built with React. It features dark/light theme integration and utilizes the Gemini API for chatbot responses.

## Installation Guide

Follow these steps to set up and run the project:

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js) or yarn

### Step 1: Clone the Repository
```sh
git clone https://github.com/Algo-Squad-Camp/Xylos.git
cd react-chatbot
```

### Step 2: Install Dependencies
```sh
npm install
# or
yarn install
```

### Step 3: Set Up the API Key
You need to configure the Gemini API key inside a `.env` file.

1. Create a `.env` file in the root directory.
2. Add the following line, replacing `your-api-key` with your actual Gemini API key:
   ```sh
   REACT_APP_GEMINI_API_KEY=your-api-key
   ```
3. Restart the React app after setting up the environment variable.

### Step 4: Configure the API Key in `HOME.jsx`

Inside `src/pages/HOME.jsx`, import the API key and initialize the Gemini API client:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
```

Ensure `process.env.REACT_APP_GEMINI_API_KEY` is correctly referenced and accessible.

### Step 5: Run the React Application
To start the development server, run:
```sh
npm start
# or
yarn start
```

This will open the chatbot application in your default web browser at `http://localhost:3000`.

## Features
- **Single-Page Application**: Built with React for a seamless user experience.
- **Dark/Light Theme Toggle**: Saves user preference in local storage.
- **Chatbot Integration**: Utilizes Google Gemini API to generate responses.
- **Responsive Design**: Works well on mobile and desktop devices.

## Troubleshooting
- If you see `undefined API key` error, ensure your `.env` file is properly set and restart the application.
- Clear browser cache if theme toggle does not persist.

## Deployment
To build the application for production, run:
```sh
npm run build
# or
yarn build
```
This will generate optimized static files in the `build/` folder.

You can then deploy it to any static hosting provider like Vercel, Netlify, or GitHub Pages.


OUTPUT:
<div align=center>

<img src="https://i.postimg.cc/PrgB7sp2/IMG-9499.png)](https://postimg.cc/QHq4BzqT" width=500 height=900>
   
</div>

![image](https://github.com/user-attachments/assets/de73034d-6bd0-48a9-85c6-4b6bf0e7b2a3)
LEFT PANEL
![image](https://github.com/user-attachments/assets/838c7f19-8bf6-44ce-be9e-e766e114c527)


---
### Happy Coding! 🚀

