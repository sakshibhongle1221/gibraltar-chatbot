import React from 'react';
import { Content, ToastNotification } from '@carbon/react';
import AppHeader from './components/Header';
import MainContent from "./components/mainContent.jsx";
import { ChatProvider, useChat } from './context/ChatContext';
import '@carbon/styles/css/styles.css';
import './App.scss';

function ToastContainer() {
  const { toastMessage, clearToast } = useChat();
  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <ToastNotification
        kind={toastMessage.kind}
        title={toastMessage.kind === 'error' ? 'Limit Reached' : 'Notification'}
        subtitle={toastMessage.message}
        timeout={5000}
        onClose={clearToast}
        onCloseButtonClick={clearToast}
      />
    </div>
  );
}

function AppContent() {
  return (
    <>
      <AppHeader />
      <Content>
        <MainContent />
      </Content>
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}