import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  TextArea,
  IconButton,
  Layer,
  Stack
} from '@carbon/react';
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  Checkmark,
  Reply,
  AiRecommend
} from '@carbon/icons-react';
import { useChat } from '../context/ChatContext';
import { botResponses } from './botResponses';
import './ChatPanel.scss';

const getRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * botResponses.length);
  return botResponses[randomIndex];
};

const formatMessageForCopy = (content) => {
  if (typeof content === 'string') return content;
  
  let text = '';
  if (content.paragraphs) {
    text += content.paragraphs.join('\n\n');
  }
  if (content.sections) {
    content.sections.forEach((section) => {
      text += `\n\n${section.title}\n`;
      text += section.text;
      if (section.bullets) {
        text += '\n';
        section.bullets.forEach((bullet) => {
          text += `\n• ${bullet}`;
        });
      }
    });
  }
  return text.trim();
};

function HoverableTextBlock({ 
  children, 
  text, 
  messageId, 
  depth, 
  parentKey, 
  canNest,
  onAiRecommend 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { 
    nestedStack, 
    openNestedConversation, 
    hasNest,
    getNestKey
  } = useChat();
  const timeoutRef = useRef(null);
  const blockRef = useRef(null);

  const currentNest = nestedStack[depth];
  const isNestedActive = currentNest?.contextText === text && currentNest?.messageId === messageId;

  const hasStoredNest = hasNest(depth, messageId, text, parentKey);
  const showStoredNestButton = hasStoredNest && !isNestedActive;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    if (blockRef.current && blockRef.current.contains(relatedTarget)) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 10);
  };

  const handleReply = () => {
    openNestedConversation(text, messageId, depth, parentKey);
  };

  const handleNestClick = () => {
    openNestedConversation(text, messageId, depth, parentKey);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showDarkBackground = isNestedActive;
  const showHoverActions = isHovered && !isNestedActive && !hasStoredNest && canNest;

  return (
    <div
      ref={blockRef}
      className={`hoverable-block ${isHovered && !showStoredNestButton && !isNestedActive ? 'hoverable-block--active' : ''} ${showDarkBackground ? 'hoverable-block--nested-active' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hoverable-block__content">
        {children}

        {isNestedActive && (
          <Button 
            kind="secondary" 
            size="sm"
            style={{ paddingLeft: '16px', paddingRight: '16px' }} 
            className="hoverable-block__nest-btn"
            onClick={handleNestClick}
          >
            {depth === 0 ? 'Nest' : `Nest(L${depth + 1})`}
          </Button>
        )}

        {showStoredNestButton && (
          <Button 
            kind="secondary" 
            size="sm"
            style={{ paddingLeft: '16px', paddingRight: '16px' }} 
            className="hoverable-block__nest-btn hoverable-block__nest-btn--stored"
            onClick={handleNestClick}
          >
            {depth === 0 ? 'Nest' : `Nest(L${depth + 1})`}
          </Button>
        )}
      </div>
      {showHoverActions && (
        <div 
          className="hoverable-block__actions"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <IconButton
            kind="ghost"
            size="sm"
            label="Reply"
            align="left"
            onClick={handleReply}
          >
            <Reply size={16} />
          </IconButton>
          <IconButton
            kind="ghost"
            size="sm"
            label="AI Recommend"
            align="left"
            onClick={() => onAiRecommend && onAiRecommend()}
          >
            <AiRecommend size={16} />
          </IconButton>
        </div>
      )}
    </div>
  );
}

function Message({ 
  message, 
  depth, 
  parentKey, 
  canNest, 
  onCopy, 
  copiedMessage,
  onAiRecommend 
}) {
  const isUser = message.type === 'user';
  const content = message.content;

  return (
    <div className={`chat-panel-message chat-panel-message--${message.type}`}>
      {!isUser && (
        <div className="chat-panel-message__avatar chat-panel-message__avatar--bot">
          <img src={message.avatar} alt="Gibraltar" />
        </div>
      )}

      <div className="chat-panel-message__content">
        {isUser ? (
          <p className="chat-panel-message__text">{content}</p>
        ) : (
          <Stack gap={5}>
            {content.paragraphs?.map((para, idx) => (
              <HoverableTextBlock
                key={idx}
                text={para}
                messageId={message.id}
                depth={depth}
                parentKey={parentKey}
                canNest={canNest}
                onAiRecommend={onAiRecommend}
              >
                <p className="chat-panel-message__text">{para}</p>
              </HoverableTextBlock>
            ))}
            {content.sections?.map((section, idx) => (
              <HoverableTextBlock
                key={`section-${idx}`}
                text={section.text}
                messageId={message.id}
                depth={depth}
                parentKey={parentKey}
                canNest={canNest}
                onAiRecommend={onAiRecommend}
              >
                <div>
                  <h4 className="chat-panel-message__heading">{section.title}</h4>
                  <p className="chat-panel-message__text">{section.text}</p>
                  {section.bullets && (
                    <ul className="chat-panel-message__list">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </HoverableTextBlock>
            ))}
            <div className="chat-panel-message__actions">
              <IconButton kind="ghost" size="sm" label="Like" align="bottom">
                <ThumbsUp size={16} />
              </IconButton>
              <IconButton kind="ghost" size="sm" label="Dislike" align="bottom">
                <ThumbsDown size={16} />
              </IconButton>
              <IconButton
                kind="ghost"
                size="sm"
                label={copiedMessage === message.id ? "Copied!" : "Copy"}
                align="bottom"
                onClick={() => onCopy(message.id, content)}
              >
                {copiedMessage === message.id ? (
                  <Checkmark size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </IconButton>
              <IconButton kind="ghost" size="sm" label="Share" align="bottom">
                <Share size={16} />
              </IconButton>
            </div>
          </Stack>
        )}
      </div>

      {isUser && (
        <div className="chat-panel-message__avatar">
          <img src={message.avatar} alt="User" />
        </div>
      )}
    </div>
  );
}

export default function ChatPanel({ 
  messages, 
  contextText = null,
  depth = 0, 
  parentKey = null,
  onSubmit, 
  onClose = null, 
  placeholder = "Ask Gibraltar",
  helperText = "Nested conversations are on",
  submitButtonText = "Ask Gibraltar",
  closeButtonText = "Close Nest"
}) {
  const { 
    nestedStack, 
    maxNestDepth,
    addMessages,
    addNestedMessage,
    closeNestedConversation,
    activeChatId,
    updateChatName
  } = useChat();
  
  const [inputValue, setInputValue] = useState('');
  const [copiedMessage, setCopiedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const canNest = depth < maxNestDepth - 1;

  const currentNestKey = depth === 0 ? activeChatId : nestedStack[depth - 1]?.key;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setInputValue('');
  }, [depth, parentKey]);

  const handleCopy = async (messageId, content) => {
    const textToCopy = formatMessageForCopy(content);
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedMessage(messageId);
      setTimeout(() => setCopiedMessage(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleAiRecommend = () => {
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      avatar: 'https://static.thenounproject.com/png/2781297-512.png'
    };
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: getRandomResponse(),
      avatar: 'https://static.thenounproject.com/png/2781734-512.png'
    };

    if (onSubmit) {
      onSubmit([userMessage, botMessage]);
    } else if (depth === 0) {
      const userMessages = messages.filter(m => m.type === 'user');
      if (userMessages.length === 0) {
        updateChatName(activeChatId, inputValue.trim());
      }
      addMessages([userMessage, botMessage]);
    } else {
      addNestedMessage([userMessage, botMessage], depth - 1);
    }

    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeNestedConversation(depth - 1);
    }
  };

  return (
    <div className="chat-panel">
      <Layer className="chat-panel__messages">
        <Stack gap={6}>
          {contextText && (
            <div className="chat-panel__context">
              <div className="chat-panel__context-avatar">
                <img 
                  src="https://static.thenounproject.com/png/2781734-512.png" 
                  alt="Gibraltar" 
                />
              </div>
              <p className="chat-panel__context-text">{contextText}</p>
            </div>
          )}
          
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              depth={depth}
              parentKey={currentNestKey}
              canNest={canNest}
              onCopy={handleCopy}
              copiedMessage={copiedMessage}
              onAiRecommend={handleAiRecommend}
            />
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Layer>

      <Layer className="chat-panel__input">
        <div className="chat-panel__input-container">
          <TextArea
            id={`chat-textarea-${depth}`}
            labelText={placeholder}
            hideLabel
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <p className="cds--label chat-panel__helper">{helperText}</p>
          <div className="chat-panel__actions">
            {depth > 0 && (
              <Button 
                kind="secondary" 
                size="md"
                style={{ paddingLeft: '16px', paddingRight: '16px' }}
                onClick={handleClose}
              >
                {closeButtonText}
              </Button>
            )}
            <Button
              kind="primary"
              size="md"
              style={{ paddingLeft: '16px', paddingRight: '16px' }}
              onClick={handleSubmit}
            >
              {submitButtonText}
            </Button>
          </div>
        </div>
      </Layer>
    </div>
  );
}