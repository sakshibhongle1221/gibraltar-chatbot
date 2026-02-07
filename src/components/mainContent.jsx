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
import './mainContent.scss';
import { botResponses } from './botResponses';
import { useChat } from '../context/ChatContext';

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

function HoverableTextBlock({ children, onReply, onAiRecommend }) {
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
      className={`hoverable-block ${isHovered ? 'hoverable-block--active' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hoverable-block__content">
        {children}
      </div>
      {isHovered && (
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
            onClick={onReply}
          >
            <Reply size={16} />
          </IconButton>
          <IconButton
            kind="ghost"
            size="sm"
            label="AI Recommend"
            align="left"
            onClick={onAiRecommend}
          >
            <AiRecommend size={16} />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default function MainContent() {
  const { messages, activeChatId, addMessages, updateChatName } = useChat();
  const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
  const [copiedMessage, setCopiedMessage] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChatId]);

  useEffect(() => {
    setInputValue('');
  }, [activeChatId]);

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

  const handleReply = (text) => {
    setInputValue(text);
  };

  const handleAiRecommend = () => {

  };

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

      const userMessages = messages.filter(m => m.type === 'user');
      if (userMessages.length === 0) {
        updateChatName(activeChatId, inputValue.trim());
      }

      addMessages([userMessage, botMessage]);
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
    <div className="chat-content">
      <Layer className="chat-messages">
        <Stack gap={6}>
          {messages.map((message) => (
            <div key={message.id} className={`message message--${message.type}`}>
              {message.type === 'bot' && (
                <div className="message__avatar message__avatar--bot">
                  <img src={message.avatar} alt="Gibraltar" />
                </div>
              )}

              <div className="message__content">
                {message.type === 'user' ? (
                  <p className="message__text">{message.content}</p>
                ) : (
                  <Stack gap={5}>
                    {message.content.paragraphs.map((para, idx) => (
                      <HoverableTextBlock
                        key={idx}
                        onReply={() => handleReply(para)}
                        onAiRecommend={() => handleAiRecommend(para)}
                      >
                        <p className="message__text">{para}</p>
                      </HoverableTextBlock>
                    ))}
                    {message.content.sections && message.content.sections.map((section, idx) => (
                      <HoverableTextBlock
                        key={idx}
                        onReply={() => handleReply(section.text)}
                        onAiRecommend={() => handleAiRecommend(section.text)}
                      >
                        <div>
                          <h4 className="message__heading">{section.title}</h4>
                          <p className="message__text">{section.text}</p>
                          {section.bullets && (
                            <ul className="message__list">
                              {section.bullets.map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </HoverableTextBlock>
                    ))}
                    <div className="message__actions">
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
                <div className="message__avatar message__avatar--user">
                  <img src={message.avatar} alt="User" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Layer>

      <Layer className="chat-input">
        <div className="chat-input__container">
          <TextArea
            id="chat-textarea"
            labelText="Ask Gibraltar"
            hideLabel
            placeholder="Ask Gibraltar"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <p className="cds--label chat-input__helper">Nested conversation are on</p>
          <div className="chat-input__submit">
            <Button
            kind="primary"
            size="md"
            style={{ paddingLeft: '16px', paddingRight: '16px' }}
            onClick={handleSubmit}
            >
              Ask Gibraltar
            </Button>
          </div>
        </div>
      </Layer>
    </div>
  );
}