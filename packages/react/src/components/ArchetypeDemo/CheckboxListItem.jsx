import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'carbon-components-react';

const CheckboxListItemPropTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  primaryValue: PropTypes.string.isRequired,
};

const DefaultCheckboxListItemProps = {};

const CheckboxListItem = ({ primaryValue, checked, onChange, id }) => {
  return (
    <li>
      <Checkbox
        id={id}
        checked={checked}
        labelText={primaryValue}
        onChange={onChange}
        onClick={(event) => {
          // This is needed as a workaround for a carbon checkbox bug
          // https://github.com/carbon-design-system/carbon/issues/10122#issuecomment-984692702
          event.stopPropagation();
        }}
      />
    </li>
  );
};
CheckboxListItem.propTypes = CheckboxListItemPropTypes;
CheckboxListItem.defaultProps = DefaultCheckboxListItemProps;
export default CheckboxListItem;
