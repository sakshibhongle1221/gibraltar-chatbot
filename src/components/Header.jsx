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
import { Share,Chat } from '@carbon/icons-react';

export default function AppHeader() {
  const [activePage, setActivePage] = React.useState('basics-flutter'); 
  return(
     <HeaderContainer render={({
  isSideNavExpanded,
  onClickSideNavExpand
}) => <>
        <Header aria-label="Sakshi's Gibraltar">
          <SkipToContent />
          <HeaderMenuButton aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'} onClick={onClickSideNavExpand} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded} />
          <HeaderName href="#" prefix="Sakshi's">
            Gibraltar
          </HeaderName>
          <HeaderNavigation aria-label="Main navigation">
            <HeaderMenuItem href="#">Source Code</HeaderMenuItem>
        <HeaderMenuItem href="#">My Github</HeaderMenuItem>
        <HeaderMenuItem href="#">Resume</HeaderMenuItem>
          </HeaderNavigation>
          <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label="Share"
          tooltipAlignment="end"
        >
          <Share size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
          <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} onSideNavBlur={onClickSideNavExpand} href="#main-content">
            <SideNavItems>
              <HeaderSideNavItems hasDivider={true}>
                <HeaderMenuItem href="#">Source Code</HeaderMenuItem>
        <HeaderMenuItem href="#">My Github</HeaderMenuItem>
        <HeaderMenuItem href="#">Resume</HeaderMenuItem>
              </HeaderSideNavItems>
<SideNavLink href="#" renderIcon={Chat}
        isActive={activePage === 'new-chat'}
            onClick={(e) => {
    e.preventDefault();
    setActivePage('new-chat');
  }}>
          New chat
        </SideNavLink>
        <SideNavDivider />
          <SideNavLink
            href="#"
            isActive={activePage === 'basics-flutter'}
            onClick={(e) => {
    e.preventDefault();
    setActivePage('basics-flutter');
  }} >
            Basics of Flutter
          </SideNavLink>
          <SideNavLink
            href="#"
            isActive={activePage === 'react-template'}
            onClick={(e) => {
    e.preventDefault();
    setActivePage('react-template');
  }} >
            React template
          </SideNavLink>
          <SideNavLink
            href="#"
            isActive={activePage === 'python-llms'}
            onClick={(e) => {
    e.preventDefault();
    setActivePage('python-llms');
  }} >
            Python LLMs
          </SideNavLink>
            </SideNavItems>
          </SideNav>
        </Header>
      </>} />
  );
}