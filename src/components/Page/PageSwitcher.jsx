import React from 'react';
import PropTypes from 'prop-types';
import { ContentSwitcher, Switch } from 'carbon-components-react';
import styled from 'styled-components';

// import { COLORS, PADDING } from '../../styles/styles';

const StyledContentSwitcher = styled(ContentSwitcher)`
  && {
    height: auto;
    margin-bottom: 1rem;
    justify-content: flex-start;

    .bx--content-switcher-btn {
      position: relative;
      max-width: 10rem;
    }
  }
`;

const propTypes = {
  /** The switcher actions */
  switcher: PropTypes.shape({
    onChange: PropTypes.func,
    selectedIndex: PropTypes.number,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string,
      })
    ).isRequired,
  }),
};

const defaultProps = {
  switcher: {
    onChange: null,
    selectedIndex: null,
  },
};

const PageSwitcher = ({ switcher: { onChange, selectedIndex, options } }) => (
  <StyledContentSwitcher onChange={id => onChange(id)} selectedIndex={selectedIndex}>
    {options.map(item => (
      <Switch key={item.id} text={item.text} data-tip={item.text} />
    ))}
  </StyledContentSwitcher>
);

PageSwitcher.propTypes = propTypes;
PageSwitcher.defaultProps = defaultProps;

export default PageSwitcher;
