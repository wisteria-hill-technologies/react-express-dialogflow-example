import React from 'react';
import ChatBox from './ChatBox';
import './App.css';

const App: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Chatbot Example With Dialogflow</h1>
      <ChatBox />
    </div>
  );
}

export default App;
