# Web_chat
This is a web chat application that i have made. 


## Overview

The Web Chat App is a simple React-based chat interface that allows users to send and display messages. It demonstrates frontend development using React, HTML, CSS, and JavaScript.

## Features

✅ Simple chat interface
✅ Real-time message display (local state)
✅ Styled with CSS for a clean UI
✅ Responsive and interactive
✅ Deployable on AWS S3 via GitHub Actions

📁 Project Structure

/web_chat_app
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── public/
│   │   ├── index.html
│   ├── styles/
│   │   ├── index.css
│── .github/workflows/
│   ├── deploy_frontend.yml
│── README.md
📦 Installation & Setup



Install Dependencies
npm install
Run the App Locally
npm start
Deploy to AWS S3
npm run build
aws s3 sync ./build s3://your-bucket-name --delete
📜 License

This project is licensed under the MIT License.

🌟 Star this repo if you found it useful! 🚀
