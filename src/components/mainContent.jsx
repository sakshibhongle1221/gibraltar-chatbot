import React from 'react';
import { useChat } from '../context/ChatContext';
import ChatPanel from './ChatPanel';
import './mainContent.scss';

export default function MainContent() {
  const { 
    messages, 
    nestedStack,
    maxNestDepth
  } = useChat();

  const totalPanels = 1 + nestedStack.length;
  const isSinglePanel = totalPanels === 1;

  const getPanelClass = (isMain = false) => {
    const baseClass = isMain ? 'chat-content' : 'nested-content';
    if (totalPanels === 1) return baseClass;
    return `${baseClass} ${baseClass}--panels-${totalPanels}`;
  };

  const wrapperClass = `chat-wrapper${isSinglePanel ? ' chat-wrapper--single-panel' : ''}`;

  return (
    <div className={wrapperClass}>
      <div className={getPanelClass(true)}>
        <ChatPanel
          messages={messages}
          depth={0}
          placeholder="Ask Gibraltar"
          helperText="Nested conversations are on"
        />
      </div>

      {nestedStack.map((nest, index) => (
        <div key={nest.key} className={getPanelClass(false)}>
          <ChatPanel
            messages={nest.messages}
            contextText={nest.contextText}
            depth={index + 1}
            parentKey={nest.key}
            placeholder="Query based on retained context"
            helperText={`Nest(L${index + 1}) created & context retained`}
            closeButtonText={`Close(L${index + 1})`}
          />
        </div>
      ))}
    </div>
  );
}