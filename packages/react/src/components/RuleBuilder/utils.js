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

export const updateRuleAtPath = (arr, rule, path) => {
  const updatePoint = path.pop();
  let current = arr;
  for (let i = 0; i < path.length; i += 1) {
    current = current[path[i]].rules;
  }

  current.splice(updatePoint, 1, rule);

  return [...arr];
};

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

export const generateRule = () => {
  return {
    id: Math.random().toString(36).substring(2, 12),
    column: '',
    logic: 'EQ',
    value: '',
  };
};

export const generateRuleGroup = () => {
  return {
    id: Math.random().toString(36).substring(2, 12),
    groupLogic: 'ALL',
    rules: [generateRule()],
  };
};

export const addRule = (arr, ruleId, isGroup = false) => {
  const generate = isGroup ? generateRuleGroup : generateRule;

  if (ruleId) {
    const rulePath = findRulePathById(arr, ruleId);
    return insertRuleAfterPath([...arr], generate(), rulePath);
  }

  return [...arr, generate()];
};
