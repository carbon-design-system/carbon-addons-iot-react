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

  return [...arr];
};

/**
 * RuleBuilder helper function to update the rule at the given path in the tree
 *
 * @param {array} arr RuleBuilder tree rules
 * @param {object} rule The new rule object to replace the existing
 * @param {array} path The array of indicies making a path to the location after which the rule should be inserted
 */
export const updateRuleAtPath = (arr, rule, path) => {
  const updatePoint = path.pop();
  let current = arr;
  for (let i = 0; i < path.length; i += 1) {
    current = current[path[i]].rules;
  }

  current.splice(updatePoint, 1, rule);

  return [...arr];
};

/**
 *
 * @param {array} arr Array of rules from the RuleBuilder tree
 * @param {array} path Array of indicies that define the path down the rule tree to grab a specific rule.
 */
export const getRuleByPath = (arr, path) => {
  if (!Array.isArray(path) || !Array.isArray(arr)) {
    return undefined;
  }

  return path.reduce((carry, part) => {
    if (carry && carry[part]) {
      return carry && carry[part];
    }

    if (carry && carry.rules[part]) {
      return carry && carry.rules[part];
    }

    return undefined;
  }, arr);
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
    groupLogic: 'ALL',
    rules: [generateRule()],
  };
};

/**
 * Helper function to insert a new rule or group after the given ID. Searches the
 * rules tree to find the rule with the given ID, and uses that path to insert a new rule (or group)
 * after it.
 *
 * @param {array} arr RuleBuilder tree rules array
 * @param {string} ruleId The rule id after which the new rule should
 * @param {boolean} isGroup Is the new rule being added a group or an individual rule
 */
export const addRule = (arr, ruleId, isGroup = false) => {
  const generate = isGroup ? generateRuleGroup : generateRule;

  if (ruleId) {
    const rulePath = findRulePathById(arr, ruleId);
    return insertRuleAfterPath([...arr], generate(), rulePath);
  }

  return [...arr, generate()];
};

export const slugify = (text) => {
  if (!text) {
    return '';
  }

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};
