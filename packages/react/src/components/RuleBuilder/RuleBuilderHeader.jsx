import * as React from 'react';
import { Button } from 'carbon-components-react';
import { Add32, TextNewLine32 } from '@carbon/icons-react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';

import GroupLogic from './GroupLogic';
import { GroupLogicPropType } from './Rule';

const { iotPrefix } = settings;

const defaultProps = {
  i18n: {
    addRule: 'Add rule',
    addGroup: 'Add group',
  },
  groupLogic: 'ALL',
  testID: 'rule-builder-header',
};

const propTypes = {
  id: PropTypes.string.isRequired,
  groupLogic: GroupLogicPropType,
  i18n: PropTypes.shape({
    addRule: PropTypes.string,
    addGroup: PropTypes.string,
  }),
  onAddRule: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  testID: PropTypes.string,
};

const RuleBuilderHeader = ({ id, onAddRule, onChange, i18n, groupLogic, testID }) => {
  const mergedI18n = React.useMemo(
    () => ({
      ...defaultProps.i18n,
      ...(i18n ?? {}),
    }),
    [i18n]
  );

  const handleChangeGroupLogic = React.useCallback(
    ({ selectedItem }) => {
      onChange(
        {
          id,
          groupLogic: selectedItem.name,
        },
        true
      );
    },
    [id, onChange]
  );
  return (
    <div data-testid={testID} className={`${iotPrefix}--rule-builder-header`}>
      <GroupLogic id={id} selected={groupLogic} onChange={handleChangeGroupLogic} />
      <div className={`${iotPrefix}--rule-builder-header__buttons`}>
        <Button
          data-testid={`${testID}-add-rule-button`}
          kind="ghost"
          renderIcon={Add32}
          onClick={onAddRule()}
        >
          {mergedI18n.addRule}
        </Button>
        <Button
          data-testid={`${testID}-add-group-button`}
          kind="ghost"
          renderIcon={TextNewLine32}
          onClick={onAddRule(undefined, true)}
        >
          {mergedI18n.addGroup}
        </Button>
      </div>
    </div>
  );
};

RuleBuilderHeader.defaultProps = defaultProps;
RuleBuilderHeader.propTypes = propTypes;
export default RuleBuilderHeader;
