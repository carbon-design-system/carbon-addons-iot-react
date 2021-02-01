import * as React from 'react';
import { Button, Dropdown, TextInput } from 'carbon-components-react';
import { Add32, Subtract32, TextNewLine32 } from '@carbon/icons-react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';

import GroupLogic from './GroupLogic';
import { RuleBuilderColumnsPropType } from './RuleBuilderPropTypes';

const { iotPrefix } = settings;

const defaultProps = {
  i18n: {
    all: 'ALL',
    any: 'ANY',
    lessThan: 'Less than',
    lessThanOrEqual: 'Less than or equal to',
    notEqual: 'Not equal',
    equals: 'Equals',
    greaterThanOrEqual: 'Greater than or equal to',
    greaterThan: 'Greater than',
    selectAColumn: 'Select a column',
  },
};

export const GroupLogicPropType = PropTypes.oneOf(['ALL', 'ANY']);
export const RulesPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  operand: PropTypes.string.isRequired,
});

export const RuleGroupPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  groupLogic: GroupLogicPropType.isRequired,
});

RuleGroupPropType.rules = PropTypes.arrayOf(PropTypes.oneOf([RulesPropType, RuleGroupPropType]));

const propTypes = {
  rule: PropTypes.oneOfType([RulesPropType, RuleGroupPropType]).isRequired,
  columns: RuleBuilderColumnsPropType.isRequired,
  onAddRule: PropTypes.func.isRequired,
  onRemoveRule: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    all: PropTypes.string,
    any: PropTypes.string,
    lessThan: PropTypes.string,
    lessThanOrEqual: PropTypes.string,
    notEqual: PropTypes.string,
    equals: PropTypes.string,
    greaterThanOrEqual: PropTypes.string,
    greaterThan: PropTypes.string,
    selectAColumn: PropTypes.string,
  }),
};

const Rule = ({ rule, onAddRule, onRemoveRule, onChange, columns, i18n }) => {
  const { id: ruleId, value, operand, columnId, groupLogic, rules } = rule;
  const getColumnById = React.useMemo(
    () => (id) => {
      return columns.find(({ id: colId }) => id === colId);
    },
    [columns]
  );

  const mergedI18n = React.useMemo(
    () => ({
      ...defaultProps.i18n,
      ...(i18n ?? {}),
    }),
    [i18n]
  );

  const defaultOperands = React.useMemo(
    () => [
      {
        id: 'NEQ',
        name: mergedI18n.notEqual,
      },
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

  const getOperandByColumnId = React.useMemo(
    () => (id) => {
      const col = getColumnById(id);
      const operands = (col && col.operands) || defaultOperands;

      const foundOp = operands.find((op) => op.id === operand);

      if (foundOp) {
        return foundOp.id;
      }

      return operands[0].id;
    },
    [defaultOperands, getColumnById, operand]
  );

  const handleChangeLogic = React.useCallback(
    ({ selectedItem }) => {
      onChange({
        id: ruleId,
        operand: selectedItem.id,
      });
    },
    [ruleId, onChange]
  );

  const handleChangeColumn = React.useCallback(
    ({ selectedItem }) => {
      onChange({
        id: ruleId,
        columnId: selectedItem.id,
        operand: getOperandByColumnId(selectedItem.id),
      });
    },
    [getOperandByColumnId, onChange, ruleId]
  );

  const handleChangeValue = React.useCallback(
    (newValue) => {
      onChange({
        id: ruleId,
        value: newValue,
      });
    },
    [ruleId, onChange]
  );

  const handleChangeGroupLogic = React.useCallback(
    ({ selectedItem }) => {
      onChange({
        id: ruleId,
        groupLogic: selectedItem.id,
      });
    },
    [ruleId, onChange]
  );

  const selectedColumn = React.useMemo(() => {
    return getColumnById(columnId);
  }, [columnId, getColumnById]);

  const columnLogic = React.useMemo(() => {
    if (selectedColumn && selectedColumn.operands) {
      return selectedColumn.operands;
    }

    return defaultOperands;
  }, [defaultOperands, selectedColumn]);

  const initialSelectedLogic = React.useMemo(() => {
    const found = columnLogic.find(({ id }) => id === operand);

    if (found) {
      return found;
    }

    return columnLogic && columnLogic[0];
  }, [columnLogic, operand]);

  const handleDefaultChangeValue = React.useCallback(
    (e) => {
      if (e && e.target && e.target.value) {
        handleChangeValue(e.target.value);
      }
    },
    [handleChangeValue]
  );

  if (groupLogic && Array.isArray(rules)) {
    return (
      <div className={`${iotPrefix}--rule-builder-rule--group`}>
        <GroupLogic
          id={ruleId}
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
    <div data-testid={`${ruleId}-rule`} className={`${iotPrefix}--rule-builder-rule`}>
      <Dropdown
        id={`${ruleId}-column-dropdown`}
        items={columns}
        label={(selectedColumn && selectedColumn.name) || mergedI18n.selectAColumn}
        itemToString={(item) => item.name}
        selectedItem={selectedColumn || undefined}
        initialSelectedItem={selectedColumn || undefined}
        onChange={handleChangeColumn}
        data-testid={`${ruleId}-column-dropdown`}
      />
      <Dropdown
        id={`${ruleId}-logic-dropdown`}
        items={columnLogic}
        itemToString={(item) => item.name}
        label={initialSelectedLogic.name}
        selectedItem={initialSelectedLogic}
        onChange={handleChangeLogic}
        data-testid={`${ruleId}-logic-dropdown`}
      />
      {selectedColumn && selectedColumn.renderField ? (
        selectedColumn.renderField({ value, onChange: handleChangeValue })
      ) : (
        <TextInput
          id={`${ruleId}-value`}
          labelText=""
          defaultValue={value}
          onChange={handleDefaultChangeValue}
          data-testid={`${ruleId}-value`}
        />
      )}

      <div className={`${iotPrefix}--rule-builder-rule__actions`}>
        <Button
          hasIconOnly
          renderIcon={Subtract32}
          kind="ghost"
          tooltipPosition="top"
          iconDescription="Remove rule"
          onClick={onRemoveRule(ruleId)}
          data-testid={`${ruleId}-remove-rule-button`}
        />
        <Button
          hasIconOnly
          renderIcon={Add32}
          kind="ghost"
          tooltipPosition="top"
          iconDescription="Add new rule"
          onClick={onAddRule(ruleId)}
          data-testid={`${ruleId}-add-rule-button`}
        />
        <Button
          hasIconOnly
          renderIcon={TextNewLine32}
          kind="ghost"
          tooltipPosition="top"
          iconDescription="Add new rule group"
          onClick={onAddRule(ruleId, true)}
          data-testid={`${ruleId}-add-group-button`}
        />
      </div>
    </div>
  );
};

Rule.defaultProps = defaultProps;
Rule.propTypes = propTypes;

export default Rule;
