import React, { useState, useRef, useEffect } from 'react';
import { Button, TextArea, Layer, Stack, IconButton } from '@carbon/react';
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  Checkmark,
} from '@carbon/icons-react';
import { useChat } from '../context/ChatContext';
import { botResponses } from './botResponses';
import './NestedPanel.scss';

const getRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * botResponses.length);
  return botResponses[randomIndex];
};

const formatMessageForCopy = (content) => {
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

function NestedHoverableTextBlock({ children }) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const blockRef = useRef(null);

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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={blockRef}
      className={`nested-hoverable-block ${isHovered ? 'nested-hoverable-block--active' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="nested-hoverable-block__content">
        {children}
      </div>
    </div>
  );
}

export default function NestedPanel() {
  const { nestedConversation, closeNestedConversation, addNestedMessage } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [copiedMessage, setCopiedMessage] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopy = async (messageId, content) => {
    const textToCopy = formatMessageForCopy(content);

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedMessage(messageId);
      setTimeout(() => {
        setCopiedMessage(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [nestedConversation?.messages]);

  if (!nestedConversation) return null;

  const handleSubmit = () => {
    if (inputValue.trim()) {
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

      addNestedMessage([userMessage, botMessage]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="nested-chat-content">
      <div className="nested-panel">
        <div className="nested-panel__content">
          <Layer className="nested-panel__messages">
            <Stack gap={6}>
              <div className="nested-context">
                <div className="nested-context__avatar">
                  <img 
                    src="https://static.thenounproject.com/png/2781734-512.png" 
                    alt="Gibraltar" 
                  />
                </div>
                <p className="nested-context__text">
                  {nestedConversation.contextText}
                </p>
              </div>
              
              {nestedConversation.messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`nested-message nested-message--${message.type}`}
                >
                  {message.type === 'bot' && (
                    <div className="nested-message__avatar nested-message__avatar--bot">
                      <img src={message.avatar} alt="Gibraltar" />
                    </div>
                  )}

                  <div className="nested-message__content">
                    {message.type === 'user' ? (
                      <p className="nested-message__text">{message.content}</p>
                    ) : (
                      <Stack gap={5}>
                        {message.content.paragraphs.map((para, idx) => (
                          <NestedHoverableTextBlock key={idx}>
                            <p className="nested-message__text">{para}</p>
                          </NestedHoverableTextBlock>
                        ))}
                        {message.content.sections?.map((section, idx) => (
                          <NestedHoverableTextBlock key={`section-${idx}`}>
                            <div>
                              <h4 className="nested-message__heading">{section.title}</h4>
                              <p className="nested-message__text">{section.text}</p>
                              {section.bullets && (
                                <ul className="nested-message__list">
                                  {section.bullets.map((bullet, bIdx) => (
                                    <li key={bIdx}>{bullet}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </NestedHoverableTextBlock>
                        ))}
                        <div className="nested-message__actions">
                          <IconButton 
                            kind="ghost"
                            size="sm"
                            label="Like"
                            align="bottom"
                          >
                            <ThumbsUp size={16} />
                          </IconButton>
                          <IconButton
                            kind="ghost"
                            size="sm"
                            label="Dislike"
                            align="bottom"
                          >
                            <ThumbsDown size={16} />
                          </IconButton>
                          <IconButton
                            kind="ghost"
                            size="sm"
                            label={copiedMessage === message.id ? "Copied!" : "Copy"}
                            align="bottom"
                            onClick={() => handleCopy(message.id, message.content)}
                          >
                            {copiedMessage === message.id ? (
                              <Checkmark size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </IconButton>
                          <IconButton
                            kind="ghost"
                            size="sm"
                            label="Share"
                            align="bottom"
                          >
                            <Share size={16} />
                          </IconButton>
                        </div>
                      </Stack>
                    )}
                  </div>

                  {message.type === 'user' && (
                    <div className="nested-message__avatar">
                      <img src={message.avatar} alt="User" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
          </Layer>

          <Layer className="nested-panel__input">
            <TextArea
              id="nested-textarea"
              labelText="Ask about this"
              hideLabel
              placeholder="Query based on retained context"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
            />
            <p className="cds--label nested-panel__helper">Nested created & context retained</p>
            <div className="nested-panel__actions">
              <Button kind="secondary" size="md"
              style={{ paddingLeft: '16px', paddingRight: '16px' }}
              onClick={closeNestedConversation}>
                Close Nest
              </Button>
              <Button kind="primary" size="md"
              style={{ paddingLeft: '16px', paddingRight: '16px' }}
              onClick={handleSubmit}>
                Ask Gibraltar
              </Button>
            </div>
          </Layer>
        </div>
      </div>
    </div>
  );
}