import PropTypes from 'prop-types';

export const RuleBuilderColumnsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,

    /**
     * An array of operands that will be passed to the second dropdown and used for determining
     * the filtering logic. Operands require an id and a name. the onChange events will pass the
     * operand id into the operand propery of the rule object.
     */
    operands: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),

    /**
     * The renderField function will be passed one object parameter.
     * The onChange property expects only the new value of the rule to be passed--not events or other
     * details. Just the value  that will be assigned to the rule object's value property.
     *
     * @param {object} props The value property of the rule and the onChange handler to pass
     *                       changes back to the rule tree.
     */
    renderField: PropTypes.func,
  })
);

export const GroupLogicPropType = PropTypes.oneOf(['ALL', 'ANY']);
export const RulesPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number])),
  ]).isRequired,
  operand: PropTypes.string.isRequired,
});

export const RuleGroupPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  groupLogic: GroupLogicPropType.isRequired,
});

RuleGroupPropType.rules = PropTypes.arrayOf(PropTypes.oneOf([RulesPropType, RuleGroupPropType]));

export const RuleBuilderFilterPropType = PropTypes.shape({
  /** Unique id for particular filter */
  filterId: PropTypes.string,
  /** Text for main tilte of page */
  filterTitleText: PropTypes.string,
  /** Text for metadata for the filter */
  filterMetaText: PropTypes.string,
  /** tags associated with particular filter */
  filterTags: PropTypes.arrayOf(PropTypes.string),
  /** users that have access to particular filter */
  filterAccess: PropTypes.arrayOf(
    PropTypes.shape({
      userName: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      /** access types */
      access: PropTypes.oneOf(['edit', 'read']),
    })
  ),
  /** All possible users that can be granted access */
  filterUsers: PropTypes.arrayOf(
    PropTypes.shape({
      userName: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  /**
   * the rules passed into the component. The RuleBuilder is a controlled component, so
   * this works the same as passing defaultValue to a controlled input component.
   */
  filterRules: RuleGroupPropType,

  filterColumns: RuleBuilderColumnsPropType.isRequired,
});
