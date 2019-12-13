import PropTypes from 'prop-types';
import React from 'react';
import { settings } from 'carbon-components';
import './_breadcrumboverflowitem.scss';

const { prefix } = settings;

// const StyledDiv = styled.div`
//    {
//   .bx--breadcrumb-item {
//     font-weight: 400;
//     width: 100%;
//     height: 100%;
//     border: none;
//     display: inline-flex;
//     align-items: center;
//     background-color: transparent;
//     text-align: left;
//     padding: 0 1rem;
//     cursor: pointer;
//     color: #393939;
//     max-width: 11.25rem;
//     transition: outline 110ms cubic-bezier(0, 0, 0.38, 0.9),
//       background-color 110ms cubic-bezier(0, 0, 0.38, 0.9),
//       color 110ms cubic-bezier(0, 0, 0.38, 0.9);

//     &:hover {
//       color: #393939;
//     }

//     &:focus {
//       @include focus-outline('outline');
//     }

//     &::-moz-focus-inner {
//       border: none;
//     }
//   }

//   .bx--breadcrumb-item::after {
//     content: ' ';
//   }

//   .bx--breadcrumb-item .bx--link {
//     color: #393939;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;

//     &:hover {
//       color: #393939;
//     }
//   }
// }
// `;

class BreadcrumbOverflowItem extends React.Component {
  XbreadItem = React.createRef();

  static propTypes = {
    /** A callback to tell the parent menu component that the menu should be closed. */
    closeMenu: PropTypes.func,
    handleOverflowMenuItemFocus: PropTypes.func,
    children: PropTypes.node,
    /** click handler */
    onClick: PropTypes.func, // eslint-disable-line,
    onKeyDown: PropTypes.func,
    index: PropTypes.number,
  };

  static defaultProps = {
    children: null,
    closeMenu: null,
    handleOverflowMenuItemFocus: null,
    onClick: () => {},
    onKeyDown: () => {},
    index: 0,
  };

  // TODO: set variable replace number
  setTabFocus = evt => {
    if (evt.which === 40) {
      this.props.handleOverflowMenuItemFocus(this.props.index + 1);
    }
    if (evt.which === 38) {
      this.props.handleOverflowMenuItemFocus(this.props.index - 1);
    }
  };

  handleClick = evt => {
    const { onClick, closeMenu } = this.props;
    onClick(evt);
    if (closeMenu) {
      closeMenu();
    }
  };

  render() {
    const {
      closeMenu,
      onClick,
      onKeyDown,
      handleOverflowMenuItemFocus,
      index,
      children,
      ...other
    } = this.props;

    return (
      <div
        className={`${prefix}--overflow-menu-options__option`}
        {...other}
        tabIndex={0}
        role="menuitem"
        onClick={this.handleClick}
        onKeyDown={evt => {
          this.setTabFocus(evt);
          onKeyDown(evt);
        }}
        ref={this.XbreadItem}
        index={index}
      >
        {children}
      </div>
    );
  }
}

export default BreadcrumbOverflowItem;
