import { settings } from 'carbon-components';
import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { SideNavFooter } from 'carbon-components-react//lib/components/UIShell';

const { prefix } = settings;

const translations = {
  'carbon.sidenav.state.open': 'Close',
  'carbon.sidenav.state.closed': 'Open',
};

function translateById(id) {
  return translations[id];
}

export default class SideNav extends React.Component {
  static propTypes = {
    /**
     * Specify whether the side navigation is expanded or collapsed
     */
    defaultExpanded: PropTypes.bool,
    /**
     * Required props for accessibility label on the underlying menu
     */

    'aria-label': PropTypes.string, // eslint-disable-line
    'aria-labelledby': PropTypes.string, // eslint-disable-line

    /**
     * Optionally provide a custom class to apply to the underlying <li> node
     */
    className: PropTypes.string,

    /**
     * Provide a custom function for translating all message ids within this
     * component. This function will take in two arguments: the mesasge Id and the
     * state of the component. From this, you should return a string representing
     * the label you want displayed or read by screen readers.
     */
    translateById: PropTypes.func,
  };

  static defaultProps = {
    className: null,
    translateById,
    defaultExpanded: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isExpanded: props.defaultExpanded,
      isFocused: false,
    };
  }

  handleExpand = () => {
    this.setState(state => ({ isExpanded: !state.isExpanded }));
  };

  handleFocus = () => {
    this.setState(state => (!state.isFocused ? { isFocused: true } : null));
  };

  handleBlur = () => {
    this.setState(() => ({ isFocused: false }));
  };

  render() {
    const {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children, // eslint-disable-line
      className: customClassName,
      translateById: t,
    } = this.props;
    const { isExpanded, isFocused } = this.state;
    const accessibilityLabel = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    };
    const assistiveText =
      isExpanded || isFocused ? t('carbon.sidenav.state.open') : t('carbon.sidenav.state.closed');
    const className = cx({
      [`${prefix}--side-nav`]: true,
      [`${prefix}--side-nav--expanded`]: isExpanded || isFocused,
      [customClassName]: !!customClassName,
    });

    return (
      <nav
        className={`${prefix}--side-nav__navigation ${className}`}
        {...accessibilityLabel}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        {children}
        <SideNavFooter
          assistiveText={assistiveText}
          expanded={isExpanded}
          onToggle={this.handleExpand}
        />
      </nav>
    );
  }
}
