// import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
// import { CSSTransition } from 'react-transition-group';
import ClickListener from 'carbon-components-react/lib/internal/ClickListener';
import styled from 'styled-components';

import { COLORS } from '../../styles/styles';

const StyledWrap = styled.div`
   {
    background-color: ${COLORS.darkGrayHover};
    position: absolute;
    top: 100%;
  }
`;
/* eslint-disable */
class HeaderDropDown extends React.Component {
  static propTypes = {
    /** Content to render inside dropdown */
    render: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.dropDown = React.createRef();
    this.state = {
      isOpen: false,
      // isFocused: false, selectedChild: null
    };
  }

  componentDidMount() {
    const node = this.dropDown.current;
    console.log('NODE: ', node.querySelectorAll('*'));

    node.querySelectorAll('*').forEach(child => {
      child.setAttribute('tabindex', '-1');
      child.setAttribute('role', 'menuitem');
    });
  }

  hideMenu = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const { render } = this.props;
    // const recursiveProp = childrenToMap =>
    //   React.Children.map(childrenToMap, mappedChild => {
    //     console.log(children);
    //     React.cloneElement(mappedChild, { tabindex: '-1' });
    //     if (mappedChild.props.children.type) {
    //       React.Children.map(mappedChild.props.children, mappedChild2 =>
    //         React.cloneElement(mappedChild2, { tabindex: '-1' })
    //       );
    //     }
    //   });

    // const wrappedChildren = recursiveProp(children);

    const children = render.map((item, i) => {
      return <li key={`dropdown-item-${i}`}>{item.render}</li>;
    });
    return (
      <StyledWrap>
        <ul
          id="dropdown"
          role="group"
          aria-expanded="false"
          aria-labelledby="profile"
          // tabIndex="0"
          ref={this.dropDown}
          onClickOutside={this.hideMenu}>
          {children}
        </ul>
      </StyledWrap>
    );
  }
}

export default HeaderDropDown;
