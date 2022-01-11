/**
 * RuleBuilder helper function to traverse the tree and find the indicies needed to create
 * a path to the given rule ID
 *
 * @param {array} arr The RuleBuilder tree rules array
 * @param {string} id The id of the rule to find in the tree
 * @param {array} parentIndex an array of ints storing the parent indices in the path
 */
export const findRulePathById = (arr, id, parentIndex = []) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr.reduce((i, rule, index) => {
    if (Array.isArray(i) && i.length > 0) {
      return i;
    }

    if (rule.id === id) {
      return [...i, ...parentIndex, index];
    }

    if (rule.rules) {
      return findRulePathById(rule.rules, id, [...parentIndex, index]);
    }

    return i;
  }, []);
};

/**
 * RuleBuilder helper function to filter a rule out of the tree by ID
 *
 * @param {array} arr The RuleBuilder tree rules
 * @param {string} id The ID of the rule to filter out of the tree
 */
export const filterRulesById = (arr, id) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr.reduce((carry, rule) => {
    if (rule.rules && rule.rules.length) {
      const rules = filterRulesById(rule.rules, id);
      if (rules.length) {
        return [
          ...carry,
          {
            ...rule,
            rules,
          },
        ];
      }
    } else if (rule.id !== id) {
      return [...carry, rule];
    }

    return carry;
  }, []);
};

/**
 * RuleBuilder helper function to insert a new rule into the tree after the given path
 *
 * @param {array} arr RuleBuilder tree rules
 * @param {object} rule The rule object to be inserted into the tree
 * @param {array} path The array of indicies making a path to the location after which the rule should be inserted
 */
export const insertRuleAfterPath = (arr, rule, path) => {
  if (!Array.isArray(path) || !Array.isArray(arr)) {
    return undefined;
  }

  const insertionPoint = path.pop() + 1;
  let current = arr;
  for (let i = 0; i < path.length; i += 1) {
    if (current[path[i]] && current[path[i]].rules) {
      current = current[path[i]].rules;
    } else {
      throw new Error('INVALID_PATH_FOR_RULE_TREE');
    }
  }
  current.splice(insertionPoint, 0, rule);
};

/**
 * Generates a new empty rule
 */
export const generateRule = () => {
  return {
    id: Math.random().toString(36).substring(2, 12).padStart(10, '0'),
    columnId: '',
    operand: '',
    value: '',
  };
};

/**
 * Generates a new rule group with one default rule
 */
export const generateRuleGroup = () => {
  return {
    id: Math.random().toString(36).substring(2, 12).padStart(10, '0'),
    groupLogic: 'all',
    rules: [generateRule()],
  };
};
