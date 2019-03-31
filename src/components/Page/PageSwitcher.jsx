import React from 'react';
import PropTypes from 'prop-types';
import { ContentSwitcher, Switch } from 'carbon-components-react';
import styled from 'styled-components';

const StyledContentSwitcher = styled(ContentSwitcher)`
  margin-bottom: 1.875rem;
`;

const propTypes = {
  /** The switcher actions */
  switchers: PropTypes.shape({
    onChange: PropTypes.func,
    switcher: PropTypes.arrayOf(
      PropTypes.shape({
        switcherId: PropTypes.string,
        switcherText: PropTypes.string,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
      })
    ).isRequired,
  }),
};

const defaultProps = {
  switchers: {
    onChange: null,
    switcher: [],
  },
};

const PageSwitcher = ({ switchers }) => (
  <StyledContentSwitcher onChange={id => switchers.onChange(id)}>
    {switchers.switcher.map(item => (
      <Switch
        key={item.switcherId}
        name={item.switcherId}
        text={item.switcherText}
        onClick={() => item.onClick}
        disabled={item.disabled}
      />
    ))}
  </StyledContentSwitcher>
);

PageSwitcher.propTypes = propTypes;
PageSwitcher.defaultProps = defaultProps;
export default PageSwitcher;
