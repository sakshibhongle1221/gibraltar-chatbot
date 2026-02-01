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
  Share
} from '@carbon/icons-react';
import './mainContent.scss';
import { botResponses } from './botResponses';

const getRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * botResponses.length);
  return botResponses[randomIndex];
};

export default function MainContent() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const initialBotMessage = {
    id: Date.now(),
    type: 'bot',
    content: {
      paragraphs: ['Hi user what do you want to learn?'],
      sections: []
    },
    avatar: 'https://static.thenounproject.com/png/2781734-512.png'
  };

  useEffect(() => {
    setMessages([initialBotMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
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
                        <p key={idx} className="message__text">{para}</p>
                      ))}
                      {message.content.sections &&(
                      message.content.sections.map((section, idx) => (
                        <div key={idx}>
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
                      ))
                      )}
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
                          label="Copy"
                          align="bottom"
                        >
                          <Copy size={16} />
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
            ))
          }
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