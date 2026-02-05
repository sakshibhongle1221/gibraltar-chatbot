import React from 'react';
import { Content } from '@carbon/react';
import AppHeader from './components/Header';
import MainContent from "./components/mainContent.jsx";
import { ChatProvider } from './context/ChatContext';
import '@carbon/styles/css/styles.css';

export default function App() {
  return (
    <ChatProvider>
      <AppHeader />
      <Content>
        <MainContent />
      </Content>
    </ChatProvider>
  );
}