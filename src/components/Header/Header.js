import { Icon } from 'carbon-components-react';
import {
  Header as CarbonHeader,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  // HeaderMenuItem,
  // HeaderNavigation,
  // HeaderMenuButton,
} from 'carbon-components-react//lib/components/UIShell';
import { rem } from 'polished';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import { COLORS } from '../../styles/styles';

const StyledHeader = styled(CarbonHeader)`
   {
    background-color: ${COLORS.darkGray};
    margin-top: 2rem;
  }
`;
const StyledGlobalAction = styled(HeaderGlobalAction)`
   {
    align-items: center;
    display: flex;
    justify-content: center;
    min-width: 3rem;
    padding: 0 ${rem(15)};
    width: auto;
    :hover {
      background-color: ${COLORS.darkGrayHover};
    }
    :last-child svg {
      margin-left: ${rem(20)};
    }
    span {
      display: block;
    }
  }
`;
const User = styled.p`
   {
    color: white;
    font-size: 0.75rem;
    text-align: left;
  }
`;
const StyledIcon = styled(Icon)`
   {
    width: 25px;
    height: 25px;
  }
`;

const propTypes = {
  onClick: PropTypes.func.isRequired,
  /** Shows current user */
  user: PropTypes.string.isRequired,
  /** Shows tenant or Org ID */
  tenant: PropTypes.string.isRequired,
  /** Name ot follow the IBM prefix up top, left */
  appName: PropTypes.string.isRequired,
};

/**
 * Clickable card that shows "Add" button
 */
const Header = ({ appName, className, user, tenant, onClick }) => (
  <StyledHeader className={className} aria-label="main header" onClick={onClick}>
    {/* <HeaderMenuButton aria-label="Open menu" onClick={() => true} /> */}
    <HeaderName href="#" prefix="IBM">
      {appName}
    </HeaderName>
    {/* <HeaderNavigation aria-label="IBM [Platform]">
      <HeaderMenuItem element={linkElement}>Catalog</HeaderMenuItem>
    </HeaderNavigation> */}
    <HeaderGlobalBar>
      <StyledGlobalAction aria-label="Profile" onClick={() => true}>
        <StyledIcon name="header--help" fill="white" description="Icon" />
      </StyledGlobalAction>
      <StyledGlobalAction aria-label="Profile" onClick={() => true}>
        <User>
          <span>{user}</span>
          {tenant}
        </User>
        <StyledIcon name="header--avatar" fill="white" description="Icon" />
      </StyledGlobalAction>
    </HeaderGlobalBar>
  </StyledHeader>
);

Header.propTypes = propTypes;

export default Header;
