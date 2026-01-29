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
  const [activePage, setActivePage] = React.useState('basics-flutter');

  const [chats, setChats] = React.useState([
    { id: 'basics-flutter', name: 'Basics of Flutter' },
    { id: 'react-template', name: 'React template' },
    { id: 'python-llms', name: 'Python LLMs' }
  ]);

  const handleNewChat = (e) => {
    e.preventDefault();

    const newChatId = `chat-${Date.now()}`;
    const newChatName = `New Chat ${chats.length + 1}`;

    const newChat = {
      id: newChatId,
      name: newChatName
    };

    setChats(prevChats => [...prevChats, newChat]);

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
          <HeaderMenuItem href="#">Source Code</HeaderMenuItem>
          <HeaderMenuItem href="#">My Github</HeaderMenuItem>
          <HeaderMenuItem href="#">Resume</HeaderMenuItem>
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
              <HeaderMenuItem href="#">Source Code</HeaderMenuItem>
              <HeaderMenuItem href="#">My Github</HeaderMenuItem>
              <HeaderMenuItem href="#">Resume</HeaderMenuItem>
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