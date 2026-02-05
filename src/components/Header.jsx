import React from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  HeaderContainer,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavDivider,
  HeaderMenuButton,
  HeaderSideNavItems
} from '@carbon/react';
import { Share, Chat } from '@carbon/icons-react';
import { useChat } from '../context/ChatContext';

export default function AppHeader() {
  const { chats, activeChatId, createNewChat, switchChat } = useChat();

  const handleNewChat = (e) => {
    e.preventDefault();
    createNewChat();
  };

  const handleChatClick = (e, chatId) => {
    e.preventDefault();
    switchChat(chatId);
  };

  return (
    <HeaderContainer render={({
      isSideNavExpanded,
      onClickSideNavExpand
    }) => <>
      <Header aria-label="Sakshi's Gibraltar">
        <SkipToContent />
        <HeaderMenuButton 
          aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'} 
          onClick={onClickSideNavExpand} 
          isActive={isSideNavExpanded} 
          aria-expanded={isSideNavExpanded} 
        />
        <HeaderName href="#" prefix="Sakshi's">
          Gibraltar
        </HeaderName>
        <HeaderNavigation aria-label="Main navigation">
          <HeaderMenuItem href="https://github.com/sakshibhongle1221/gibraltar-chatbot.git">Source Code</HeaderMenuItem>
          <HeaderMenuItem href="https://github.com/sakshibhongle1221">My Github</HeaderMenuItem>
          <HeaderMenuItem href="https://drive.google.com/drive/folders/1PoGiXsmaDdrHvDwfDZXgnQQdkR52sy1C">Resume</HeaderMenuItem>
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Share" tooltipAlignment="end">
            <Share size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        <SideNav 
          aria-label="Side navigation" 
          expanded={isSideNavExpanded} 
          onSideNavBlur={onClickSideNavExpand} 
          href="#main-content"
        >
          <SideNavItems>
            <HeaderSideNavItems hasDivider={true}>
              <HeaderMenuItem href="https://github.com/sakshibhongle1221/gibraltar-chatbot.git">Source Code</HeaderMenuItem>
              <HeaderMenuItem href="https://github.com/sakshibhongle1221">My Github</HeaderMenuItem>
              <HeaderMenuItem href="https://drive.google.com/drive/folders/1PoGiXsmaDdrHvDwfDZXgnQQdkR52sy1C">Resume</HeaderMenuItem>
            </HeaderSideNavItems>

            <SideNavLink 
              href="#" 
              renderIcon={Chat}
              onClick={handleNewChat}
            >
              New chat
            </SideNavLink>
            
            <SideNavDivider />

            {chats.map((chat) => (
              <SideNavLink
                key={chat.id}
                href="#"
                isActive={activeChatId === chat.id}
                onClick={(e) => handleChatClick(e, chat.id)}
              >
                {chat.name}
              </SideNavLink>
            ))}
          </SideNavItems>
        </SideNav>
      </Header>
    </>} />
  );
}