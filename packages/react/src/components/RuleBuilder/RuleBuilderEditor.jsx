import * as React from 'react';
import PropTypes from 'prop-types';

import useMerged from '../../hooks/useMerged';

import Rule from './Rule';
import RuleBuilderHeader from './RuleBuilderHeader';
import {
  addRule,
  filterRulesById,
  findRulePathById,
  generateRuleGroup,
  getRuleByPath,
  updateRuleAtPath,
} from './utils';
import { RuleBuilderColumnsPropType, RuleGroupPropType } from './RuleBuilderPropTypes';

const propTypes = {
  /**
   * the rules passed into the component. The RuleBuilder is a controlled component, so
   * this works the same as passing defaultValue to a controlled input component.
   */
  defaultRules: RuleGroupPropType,

  /**
   * An array of columns of the table to be used in the column dropdown.
   * The id and name are required, but each column can also include an optional array
   * of operands (ie. `[{id: 'LT', name: 'Less than'}]`) or a renderField function to change
   * the input for that column. ie. `({value, onChange}) => <input type="date" defaultValue={value} onChange={(e) => onChange(e.target.value)} />`
   * the onChange event expects only one argument. The new value to be assigned to this rule's value property.
   */
  columns: RuleBuilderColumnsPropType.isRequired,

  /**
   * The onChange callback called on any updates to the RuleBuilder tree structure.
   * Example Structure:
   * {
   *   id: '14p5ho3pcu',
   *   groupLogic: 'ALL',
   *   rules: [
   *     {
   *       id: 'rsiru4rjba',
   *       columnId: 'column2',
   *       operand: 'EQ',
   *       value: '45',
   *     },
   *     {
   *       id: 'i34imt0geh',
   *       groupLogic: 'ANY',
   *       rules: [
   *         {
   *           id: 'ewc2z5kyfu',
   *           columnId: 'column2',
   *           operand: 'GTOET',
   *           value: '46',
   *         },
   *       ],
   *     }
   *   ]
   * }
   * @param {object} tree RuleBuilder Tree object
   */
  onChange: PropTypes.func,
  i18n: PropTypes.shape({
    addRule: PropTypes.string,
    addGroup: PropTypes.string,
  }),
  testId: PropTypes.string,
};

const defaultProps = {
  defaultRules: generateRuleGroup(),
  onChange: () => {},
  i18n: {
    addRule: 'Add rule',
    addGroup: 'Add group',
  },
  testId: 'rule-builder-editor',
};

const RuleBuilderEditor = ({ defaultRules, columns, onChange, i18n, testId }) => {
  const [tree, setTree] = React.useState(defaultRules);

  const mergedI18n = useMerged(defaultProps.i18n, i18n);

  const handleAddRule = React.useCallback(
    (ruleId, isGroup = false) => () => {
      const newTree = {
        ...tree,
        rules: addRule(tree.rules, ruleId, isGroup),
      };
      setTree(newTree);
      onChange(newTree);
    },
    [onChange, tree]
  );

  const handleRemoveRule = React.useCallback(
    (ruleId) => () => {
      const newTree = {
        ...tree,
        rules: filterRulesById([...tree.rules], ruleId),
      };
      setTree(newTree);
      onChange(newTree);
    },
    [onChange, tree]
  );

  const handleChange = React.useCallback(
    (changed, isRoot) => {
      let newTree;
      if (!isRoot) {
        const path = findRulePathById(tree.rules, changed.id);
        const rule = getRuleByPath(tree.rules, path);

        newTree = {
          ...tree,
          rules: updateRuleAtPath(
            tree.rules,
            {
              ...rule,
              ...changed,
            },
            path
          ),
        };
      } else {
        newTree = {
          ...tree,
          ...changed,
        };
      }
      setTree(newTree);
      onChange(newTree);
    },
    [onChange, tree]
  );

  return (
    <div data-testid={testId}>
      <RuleBuilderHeader
        id={tree.id}
        groupLogic={tree.groupLogic}
        onAddRule={handleAddRule}
        onChange={handleChange}
        i18n={mergedI18n}
        testId={`${testId}-header`}
      />
      {tree.rules.map((rule) => {
        return (
          <Rule
            rule={{ ...rule }}
            key={rule.id}
            onAddRule={handleAddRule}
            onRemoveRule={handleRemoveRule}
            onChange={handleChange}
            columns={columns}
            i18n={mergedI18n}
            testId={`${testId}-rule-${rule.id}`}
          />
        );
      })}
    </div>
  );
};

RuleBuilderEditor.propTypes = propTypes;
RuleBuilderEditor.defaultProps = defaultProps;

export default RuleBuilderEditor;
