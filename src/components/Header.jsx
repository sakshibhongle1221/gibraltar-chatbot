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

export default function AppHeader() {
  const [activePage, setActivePage] = React.useState('1');

  const [chats, setChats] = React.useState([
    { id: '1', name: 'Chat 3' },
    { id: '2', name: 'Chat 2' },
    { id: '3', name: 'Chat 1' }
  ]);

  const handleNewChat = (e) => {
    e.preventDefault();

    const newChatId = `chat-${Date.now()}`;
    const newChatName = `Chat ${chats.length + 1}`;

    const newChat = {
      id: newChatId,
      name: newChatName
    };

    setChats(prevChats => [newChat,...prevChats]);

    setActivePage(newChatId);
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
                isActive={activePage === chat.id}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(chat.id);
                }}
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