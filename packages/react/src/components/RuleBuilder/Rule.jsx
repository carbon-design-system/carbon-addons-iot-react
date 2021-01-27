import * as React from 'react';
import { Button, Dropdown, TextInput } from 'carbon-components-react';
import { Add32, Subtract32, TextNewLine32 } from '@carbon/icons-react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';
import { TableColumnsPropTypes } from '../Table/TablePropTypes';

import GroupLogic from './GroupLogic';

const { iotPrefix } = settings;

const defaultProps = {
  i18n: {
    all: 'ALL',
    any: 'ANY',
    lessThan: 'Less than',
    lessThanOrEqual: 'Less than or equal to',
    equals: 'Equals',
    greaterThanOrEqual: 'Greater than or equal to',
    greaterThan: 'Greater than',
  },
};

export const GroupLogicPropType = PropTypes.oneOf(['ALL', 'ANY']);
export const LogicPropType = PropTypes.oneOf(['LT', 'LTOET', 'EQ', 'GTOET', 'GT']);
export const RulesPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  column: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  logic: LogicPropType.isRequired,
});

export const RuleGroupPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  groupLogic: GroupLogicPropType.isRequired,
});

RuleGroupPropType.rules = PropTypes.arrayOf(PropTypes.oneOf([RulesPropType, RuleGroupPropType]));

const propTypes = {
  rule: PropTypes.oneOfType([RulesPropType, RuleGroupPropType]).isRequired,
  columns: TableColumnsPropTypes.isRequired,
  onAddRule: PropTypes.func.isRequired,
  onRemoveRule: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    all: PropTypes.string,
    any: PropTypes.string,
    lessThan: PropTypes.string,
    lessThanOrEqual: PropTypes.string,
    equals: PropTypes.string,
    greaterThanOrEqual: PropTypes.string,
    greaterThan: PropTypes.string,
  }),
};

const Rule = ({ rule, onAddRule, onRemoveRule, onChange, columns, i18n }) => {
  const { id, value, logic, column, groupLogic, rules } = rule;
  const mergedI18n = React.useMemo(
    () => ({
      ...defaultProps.i18n,
      ...(i18n ?? {}),
    }),
    [i18n]
  );

  const logicRules = React.useMemo(
    () => [
      {
        id: 'LT',
        name: mergedI18n.lessThan,
      },
      {
        id: 'LTOET',
        name: mergedI18n.lessThanOrEqual,
      },
      {
        id: 'EQ',
        name: mergedI18n.equals,
      },
      {
        id: 'GTOET',
        name: mergedI18n.greaterThanOrEqual,
      },
      {
        id: 'GT',
        name: mergedI18n.greaterThan,
      },
    ],
    [mergedI18n]
  );

  const handleChangeLogic = React.useCallback(
    ({ selectedItem }) => {
      onChange({
        id,
        logic: selectedItem.id,
      });
    },
    [id, onChange]
  );

  const handleChangeColumn = React.useCallback(
    ({ selectedItem }) => {
      onChange({
        id,
        column: selectedItem.id,
      });
    },
    [id, onChange]
  );

  const handleChangeValue = React.useCallback(
    (e) => {
      onChange({
        id,
        value: e.target.value,
      });
    },
    [id, onChange]
  );

  const handleChangeGroupLogic = React.useCallback(
    ({ selectedItem }) => {
      onChange({
        id,
        groupLogic: selectedItem.id,
      });
    },
    [id, onChange]
  );

  const initialSelectedColumn = React.useMemo(() => {
    const found = columns.find(({ id: columnId }) => columnId === column);
    if (found) {
      return found;
    }

    return columns && columns[0];
  }, [column, columns]);

  const initialSelectedLogic = React.useMemo(
    () => logicRules.find(({ id: logicId }) => logicId === logic),
    [logic, logicRules]
  );

  if (groupLogic && Array.isArray(rules)) {
    return (
      <div className={`${iotPrefix}--rule-builder-rule--group`}>
        <GroupLogic
          id={id}
          selected={groupLogic}
          onChange={handleChangeGroupLogic}
          i18n={mergedI18n}
        />
        {rules.map((subRule) => (
          <Rule
            rule={{ ...subRule }}
            key={subRule.id}
            onAddRule={onAddRule}
            onRemoveRule={onRemoveRule}
            onChange={onChange}
            columns={columns}
          />
        ))}
      </div>
    );
  }

  return (
    <div data-testid={`${id}-rule`} className={`${iotPrefix}--rule-builder-rule`}>
      <Dropdown
        id={`${id}-column-dropdown`}
        items={columns}
        label={initialSelectedColumn.name}
        itemToString={(item) => item.name}
        initialSelectedItem={initialSelectedColumn}
        onChange={handleChangeColumn}
        data-testid={`${id}-column-dropdown`}
      />
      <Dropdown
        id={`${id}-logic-dropdown`}
        items={logicRules}
        itemToString={(item) => item.name}
        initialSelectedItem={initialSelectedLogic}
        label={initialSelectedLogic.name}
        onChange={handleChangeLogic}
        data-testid={`${id}-logic-dropdown`}
      />
      <TextInput
        id={`${id}-value`}
        labelText=""
        defaultValue={value}
        onChange={handleChangeValue}
        data-testid={`${id}-value`}
      />
      <div className={`${iotPrefix}--rule-builder-rule__actions`}>
        <Button
          hasIconOnly
          renderIcon={Subtract32}
          kind="ghost"
          tooltipPosition="top"
          iconDescription="Remove rule"
          onClick={onRemoveRule(id)}
          data-testid={`${id}-remove-rule-button`}
        />
        <Button
          hasIconOnly
          renderIcon={Add32}
          kind="ghost"
          tooltipPosition="top"
          iconDescription="Add new rule"
          onClick={onAddRule(id)}
          data-testid={`${id}-add-rule-button`}
        />
        <Button
          hasIconOnly
          renderIcon={TextNewLine32}
          kind="ghost"
          tooltipPosition="top"
          iconDescription="Add new rule group"
          onClick={onAddRule(id, true)}
          data-testid={`${id}-add-group-button`}
        />
      </div>
    </div>
  );
};

Rule.defaultProps = defaultProps;
Rule.propTypes = propTypes;

export default Rule;
