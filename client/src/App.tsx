import React from 'react';
import ChatBox from './ChatBox';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Chatbot Example With Dialogflow</h1>
      <ChatBox />
    </div>
  );
}

export default App;
