import {
  addRule,
  filterRulesById,
  findRulePathById,
  getRuleByPath,
  insertRuleAfterPath,
  updateRuleAtPath,
} from './utils';

let tree;

const NEW_RULE_MATCH = expect.objectContaining({
  id: expect.stringMatching(/[a-zA-Z0-9]/),
  columnId: '',
  value: '',
  operand: '',
});

describe('rule builder utils', () => {
  beforeEach(() => {
    tree = {
      id: '14p5ho3pcu',
      groupLogic: 'ALL',
      rules: [
        {
          id: 'rsiru4rjba',
          columnId: 'column1',
          operand: 'EQ',
          value: '45',
        },
        {
          id: '34bvyub9jq',
          columnId: 'column2',
          operand: 'LT',
          value: '14',
        },
        {
          id: 'i34imt0geh',
          groupLogic: 'ANY',
          rules: [
            {
              id: 'ewc2z5kyfu',
              columnId: 'column2',
              operand: 'GTOET',
              value: '46',
            },
            {
              id: 'hks7h2zin4',
              columnId: 'column1',
              operand: 'LT',
              value: '45',
            },
            {
              id: 'qzn8477mbg',
              groupLogic: 'ALL',
              rules: [
                {
                  id: 'wg9hlv197c',
                  columnId: '',
                  operand: 'EQ',
                  value: '',
                },
                {
                  id: 'eobo3s5tie',
                  groupLogic: 'ALL',
                  rules: [
                    {
                      id: '7kadk2wfv8',
                      columnId: 'column1',
                      operand: 'EQ',
                      value: '44',
                    },
                    {
                      id: '49mf09vjhn',
                      columnId: 'column2',
                      operand: 'EQ',
                      value: '46',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  });
  it('findRulePathById should return the proper path', () => {
    expect(findRulePathById(tree.rules, undefined)).toEqual([]);
    expect(findRulePathById(undefined, undefined)).toEqual([]);
    expect(findRulePathById(tree.rules, 'rsiru4rjba')).toEqual([0]);
    expect(findRulePathById(tree.rules, '34bvyub9jq')).toEqual([1]);
    expect(findRulePathById(tree.rules, 'i34imt0geh')).toEqual([2]);
    expect(findRulePathById(tree.rules, 'ewc2z5kyfu')).toEqual([2, 0]);
    expect(findRulePathById(tree.rules, 'hks7h2zin4')).toEqual([2, 1]);
    expect(findRulePathById(tree.rules, '49mf09vjhn')).toEqual([2, 2, 1, 1]);
  });

  it('filterRulesById should remove given ID from the tree', () => {
    const emptyRules = filterRulesById(undefined, undefined);
    expect(emptyRules).toEqual([]);

    const invalidRuleId = filterRulesById(tree.rules, undefined);
    expect(invalidRuleId).toEqual(tree.rules);

    const firstRuleRemoved = filterRulesById(tree.rules, 'rsiru4rjba');
    expect(firstRuleRemoved).toEqual(
      expect.arrayContaining([expect.not.objectContaining({ id: 'rsiru4rjba' })])
    );
    expect(firstRuleRemoved.length).toEqual(2);

    const deepRuleRemoved = filterRulesById(tree.rules, '49mf09vjhn');
    expect(deepRuleRemoved.length).toEqual(3);
    expect(deepRuleRemoved[2].rules.length).toEqual(3);
    expect(deepRuleRemoved[2].rules[2].rules.length).toEqual(2);
    expect(deepRuleRemoved[2].rules[2].rules[1].rules.length).toEqual(1);
    expect(deepRuleRemoved[2].rules[2].rules[1].rules).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: '7kadk2wfv8' })])
    );
    expect(deepRuleRemoved[2].rules[2].rules[1].rules).toEqual(
      expect.arrayContaining([expect.not.objectContaining({ id: '49mf09vjhn' })])
    );
  });

  it('insertRuleAtPath should handle bad inputs', () => {
    const rule = {
      id: 'inserted-at-0',
    };
    expect(insertRuleAfterPath(tree.rules, rule, undefined)).toEqual(undefined);
    expect(insertRuleAfterPath(undefined, rule, [0])).toEqual(undefined);
    expect(() => insertRuleAfterPath(tree.rules, rule, [2, 2, 2, 2])).toThrow(
      'INVALID_PATH_FOR_RULE_TREE'
    );
  });

  it('insertRuleAtPath inserts the rule after the given shallow path', () => {
    const rule = {
      id: 'inserted-at-0',
    };
    expect(insertRuleAfterPath(tree.rules, rule, undefined)).toEqual(undefined);
    expect(insertRuleAfterPath(undefined, rule, [0])).toEqual(undefined);
    const insertShallow = insertRuleAfterPath(tree.rules, rule, [0]);
    expect(insertShallow.length).toEqual(4);
    expect(insertShallow[1]).toEqual(expect.objectContaining(rule));
  });

  it('insertRuleAtPath inserts the rule after the given deep path', () => {
    const rule = {
      id: 'inserted-after-2-2-1-1',
    };
    const insertDeep = insertRuleAfterPath(tree.rules, rule, [2, 2, 1, 1]);
    expect(insertDeep[2].rules[2].rules[1].rules.length).toEqual(3);
    expect(insertDeep[2].rules[2].rules[1].rules).toEqual(
      expect.arrayContaining([expect.objectContaining(rule)])
    );
  });

  it('updateRuleAtPath should update the rule at the given path', () => {
    const shallowUpdatedRule = {
      id: 'rsiru4rjba',
      columnId: 'column1',
      operand: 'LT',
      value: '45',
    };
    expect(updateRuleAtPath(tree.rules, shallowUpdatedRule, [0])).toContainEqual(
      expect.objectContaining(shallowUpdatedRule)
    );

    const deepUpdatedRule = {
      id: '49mf09vjhn',
      columnId: 'column2',
      operand: 'EQ',
      value: '47',
    };
    const deepUpdate = updateRuleAtPath(tree.rules, deepUpdatedRule, [2, 2, 1, 1]);
    expect(deepUpdate[2].rules[2].rules[1].rules.length).toEqual(2);
    expect(deepUpdate[2].rules[2].rules[1].rules).toEqual(
      expect.arrayContaining([expect.objectContaining(deepUpdatedRule)])
    );
  });

  it('getRuleByPath returns the correct rule for the given path', () => {
    expect(getRuleByPath(undefined, undefined)).toEqual(undefined);
    expect(getRuleByPath(tree.rules, [0])).toEqual(tree.rules[0]);
    expect(getRuleByPath(tree.rules, [2, 2, 1, 1])).toEqual(
      tree.rules[2].rules[2].rules[1].rules[1]
    );
    expect(getRuleByPath(tree.rules, [2, 2, 2, 2])).toEqual(undefined);
  });

  it('addRule adds a new rule (or group) after the given id', () => {
    const addShallowRule = addRule(tree.rules, 'rsiru4rjba');
    expect(addShallowRule).toContainEqual(NEW_RULE_MATCH);
    expect(addShallowRule.length).toEqual(4);

    const addShallowGroup = addRule(tree.rules, undefined, true);
    expect(addShallowGroup).toContainEqual(
      expect.objectContaining({
        id: expect.stringMatching(/[a-zA-Z0-9]/),
        groupLogic: 'ALL',
        rules: expect.arrayContaining([NEW_RULE_MATCH]),
      })
    );
    expect(addShallowGroup.length).toEqual(4);

    const addDeepRule = addRule(tree.rules, '49mf09vjhn', false);
    expect(addDeepRule[2].rules[2].rules[1].rules).toContainEqual(NEW_RULE_MATCH);

    expect(addDeepRule[2].rules[2].rules[1].rules.length).toEqual(3);
  });
});
