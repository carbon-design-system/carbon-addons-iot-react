import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SideNavSwitcher as CarbonSideNavSwitcher } from 'carbon-components-react//lib/components/UIShell';

/**
 * Side Navigation. part of UI shell
 */

/* eslint-disable */
class SideNavSwitcher extends Component {
  static propTypes = {
    /** array of option objects. used to create the option array and switch the icon */
    options: PropTypes.arrayOf(
      PropTypes.shape({
        /** option value */
        title: PropTypes.string,
        /** Icon to show with selection */
        icon: PropTypes.node,
      })
    ).isRequired,
    /** callback function that is called whenever the switcher value is updated */
    onChange: PropTypes.func,
    /** first option chosen */
    labelText: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    onChange: null,
    className: null,
  };

  state = {};

  switcherOptions = [];

  icons = [];

  componentDidMount() {
    const { options } = this.props;
    options.map(option => {
      this.switcherOptions.push(option.title);
      this.icons.push(option.icon);
    });
  }

  render() {
    const { switcherTitle } = this.props;

    return (
      <div className="bx--side-nav-switcher">
        <p>{switcherTitle}</p>
        <CarbonSideNavSwitcher options={this.switcherOptions} />
      </div>
    );
  }
}

SideNavSwitcher.propTypes = propTypes;
SideNavSwitcher.defaultProps = defaultProps;

export default SideNavSwitcher;
