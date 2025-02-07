import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import './App.css';

const App = () => {
    return (
        <div className="app-container">
            <h1>Web Chat App</h1>
            <ChatWindow />
        </div>
    );
};

export default App;
