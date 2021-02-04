import * as React from 'react';
import PropTypes from 'prop-types';

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
};

const defaultProps = {
  defaultRules: generateRuleGroup(),
  onChange: () => {},
  i18n: {
    addRule: 'Add rule',
    addGroup: 'Add group',
  },
};

const RuleBuilderEditor = ({ defaultRules, columns, onChange, i18n }) => {
  const [tree, setTree] = React.useState(defaultRules);

  const mergedI18n = React.useMemo(
    () => ({
      ...defaultProps.i18n,
      ...(i18n ?? {}),
    }),
    [i18n]
  );

  const handleAddRule = React.useCallback(
    (ruleId, isGroup = false) => () => {
      setTree((prev) => {
        const newTree = {
          ...prev,
          rules: addRule(prev.rules, ruleId, isGroup),
        };

        onChange(newTree);

        return newTree;
      });
    },
    [onChange]
  );

  const handleRemoveRule = React.useCallback(
    (ruleId) => () => {
      setTree((prev) => {
        const newTree = {
          ...prev,
          rules: filterRulesById([...prev.rules], ruleId),
        };

        onChange(newTree);

        return newTree;
      });
    },
    [onChange]
  );

  const handleChange = React.useCallback(
    (changed, isRoot) => {
      setTree((prev) => {
        if (!isRoot) {
          const path = findRulePathById(prev.rules, changed.id);
          const rule = getRuleByPath(prev.rules, path);

          const newTree = {
            ...prev,
            rules: updateRuleAtPath(
              prev.rules,
              {
                ...rule,
                ...changed,
              },
              path
            ),
          };

          onChange(newTree);
          return newTree;
        }

        const newTree = {
          ...prev,
          ...changed,
        };

        onChange(newTree);
        return newTree;
      });
    },
    [onChange]
  );

  return (
    <div data-testid="rule-builder-editor">
      <RuleBuilderHeader
        id={tree.id}
        groupLogic={tree.groupLogic}
        onAddRule={handleAddRule}
        onChange={handleChange}
        i18n={mergedI18n}
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
          />
        );
      })}
    </div>
  );
};

RuleBuilderEditor.propTypes = propTypes;
RuleBuilderEditor.defaultProps = defaultProps;

export default RuleBuilderEditor;
