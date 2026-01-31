import React, { useState } from 'react';
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

export default function MainContent() {
  const [inputValue, setInputValue] = useState('');

  const messages = [
    {
      id: 1,
      type: 'user',
      content: 'Briefly explain the basics of Flutter',
      avatar: 'https://static.thenounproject.com/png/2781297-512.png'
    },
    {
      id: 2,
      type: 'bot',
      content: {
        paragraphs: [
          "Flutter is Google's open-source UI toolkit designed to build beautiful, natively compiled applications for mobile, web, desktop, and embedded devices from a single codebase.",
          "In 2026, it has solidified its place as the industry standard for cross-platform development, largely because it doesn't just \"wrap\" native components—it draws them itself."
        ],
        sections: [
          {
            title: "The Language: Dart",
            text: "Flutter uses Dart, a language also developed by Google. It's the engine under the hood that makes Flutter fast.",
            bullets: [
              "• AOT (Ahead-of-Time) Compilation: Compiles to fast, native machine code for production.",
              "• JIT (Just-in-Time) Compilation: Powers the \"Hot Reload\" feature during development, letting you see code changes in sub-seconds without losing your app's state."
            ]
          }
        ]
      },
      avatar: 'https://static.thenounproject.com/png/2781734-512.png'
    }
  ];

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log('Sending message:', inputValue);
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

                    {message.content.sections.map((section, idx) => (
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
          ))}
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