import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import RuleBuilderEditor from './RuleBuilderEditor';
import { findRulePathById, getRuleByPath } from './utils';

const { iotPrefix } = settings;
const columns = [
  {
    id: 'column1',
    name: 'Column 1',
  },
  {
    id: 'column2',
    name: 'Column 2',
  },
  {
    id: 'column3',
    name: 'Column 3',
  },
];

const NEW_RULE_MATCH = expect.objectContaining({
  id: expect.stringMatching(/[a-zA-Z0-9]{10}/),
  column: '',
  value: '',
  logic: 'EQ',
});
const TEST_TREE_DATA = {
  id: '14p5ho3pcu',
  groupLogic: 'ALL',
  rules: [
    {
      id: 'rsiru4rjba',
      column: 'column1',
      logic: 'EQ',
      value: '45',
    },
    {
      id: '34bvyub9jq',
      column: 'column2',
      logic: 'LT',
      value: '14',
    },
    {
      id: 'i34imt0geh',
      groupLogic: 'ANY',
      rules: [
        {
          id: 'ewc2z5kyfu',
          column: 'column2',
          logic: 'GTOET',
          value: '46',
        },
        {
          id: 'hks7h2zin4',
          column: 'column1',
          logic: 'LT',
          value: '45',
        },
        {
          id: 'qzn8477mbg',
          groupLogic: 'ALL',
          rules: [
            {
              id: 'wg9hlv197c',
              column: '',
              logic: 'EQ',
              value: '',
            },
            {
              id: 'eobo3s5tie',
              groupLogic: 'ALL',
              rules: [
                {
                  id: '7kadk2wfv8',
                  column: 'column1',
                  logic: 'EQ',
                  value: '44',
                },
                {
                  id: '49mf09vjhn',
                  column: 'column2',
                  logic: 'EQ',
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
describe('RuleBuilderHeader', () => {
  it('should render with a single group with one empty rule', () => {
    const onChange = jest.fn();
    const { container } = render(<RuleBuilderEditor columns={columns} onChange={onChange} />);

    expect(screen.getByTestId('rule-builder-editor')).toBeDefined();
    expect(container.querySelectorAll(`.${iotPrefix}--rule-builder-rule`).length).toEqual(1);
    const groupLogic = screen.getByText('ALL');
    expect(groupLogic).toBeDefined();
    userEvent.click(groupLogic);
    userEvent.click(screen.getAllByText('ANY')[0]);

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(/[a-zA-Z0-9]{10}/),
        groupLogic: 'ANY',
        rules: expect.arrayContaining([NEW_RULE_MATCH]),
      })
    );
  });

  it('should render all rules when passed a rule tree', () => {
    const onChange = jest.fn();
    const { container } = render(
      <RuleBuilderEditor defaultRules={TEST_TREE_DATA} columns={columns} onChange={onChange} />
    );

    expect(screen.getByTestId('rule-builder-editor')).toBeDefined();
    expect(container.querySelectorAll(`.${iotPrefix}--rule-builder-rule`).length).toEqual(7);
    userEvent.click(screen.getAllByText('ALL')[0]);
    userEvent.click(screen.getAllByText('ANY')[0]);

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith({
      ...TEST_TREE_DATA,
      groupLogic: 'ANY',
    });
    expect(screen.getByTestId(`rsiru4rjba-value`)).toHaveValue('45');
    expect(screen.getByTestId(`49mf09vjhn-value`)).toHaveValue('46');
  });

  it('should remove a rule when the remove button is clicked.', () => {
    const onChange = jest.fn();
    const { container } = render(
      <RuleBuilderEditor defaultRules={TEST_TREE_DATA} columns={columns} onChange={onChange} />
    );
    userEvent.click(screen.getByTestId(`rsiru4rjba-remove-rule-button`));
    expect(onChange).toBeCalledTimes(1);
    const clone = [...TEST_TREE_DATA.rules];
    clone.splice(0, 1);
    expect(onChange).toHaveBeenCalledWith({
      ...TEST_TREE_DATA,
      rules: clone,
    });
    expect(container.querySelectorAll(`.${iotPrefix}--rule-builder-rule`).length).toEqual(6);
  });

  it('should add a rule when the add rule button is clicked.', () => {
    const onChange = jest.fn();
    const { container } = render(
      <RuleBuilderEditor defaultRules={TEST_TREE_DATA} columns={columns} onChange={onChange} />
    );
    userEvent.click(screen.getByTestId(`rsiru4rjba-add-rule-button`));
    expect(onChange).toBeCalledTimes(1);
    expect(container.querySelectorAll(`.${iotPrefix}--rule-builder-rule`).length).toEqual(8);
  });

  it('should add a rule group when the add rule group button is clicked.', () => {
    const onChange = jest.fn();
    const { container } = render(
      <RuleBuilderEditor defaultRules={TEST_TREE_DATA} columns={columns} onChange={onChange} />
    );
    userEvent.click(screen.getByTestId(`rsiru4rjba-add-group-button`));
    expect(onChange).toBeCalledTimes(1);
    expect(container.querySelectorAll(`.${iotPrefix}--rule-builder-rule`).length).toEqual(8);
  });

  it('should show the proper translations when i18n is passed.', async () => {
    const onChange = jest.fn();
    const i18n = {
      addRule: 'ADD RULEz',
    };
    const { rerender } = render(
      <RuleBuilderEditor
        defaultRules={TEST_TREE_DATA}
        columns={columns}
        onChange={onChange}
        i18n={i18n}
      />
    );
    const translations = await screen.findAllByText('ADD RULEz');
    expect(translations.length).toEqual(1);

    rerender(
      <RuleBuilderEditor
        defaultRules={TEST_TREE_DATA}
        columns={columns}
        onChange={onChange}
        i18n={null}
      />
    );
    expect((await screen.findAllByText('Add rule')).length).toEqual(1);
  });

  it("doesn't blow up when no onChange prop is passed", async () => {
    render(<RuleBuilderEditor defaultRules={TEST_TREE_DATA} columns={columns} i18n={null} />);
    expect((await screen.findAllByText('Add rule')).length).toEqual(1);
  });

  it('updates the tree state on changes', async () => {
    const onChange = jest.fn();
    render(
      <RuleBuilderEditor defaultRules={TEST_TREE_DATA} columns={columns} onChange={onChange} />
    );
    expect((await screen.findAllByText('Add rule')).length).toEqual(1);
    userEvent.type(screen.getByTestId('wg9hlv197c-value'), '100');
    expect(onChange).toBeCalled();
    userEvent.click(screen.getAllByText('Column 1')[2]);
    userEvent.click(screen.getAllByText('Column 2')[2]);
    userEvent.click(screen.getAllByText('Equals')[1]);
    userEvent.click(screen.getAllByText('Greater than')[0]);
    userEvent.click(screen.getAllByText('ALL')[1]);
    userEvent.click(screen.getAllByText('ANY')[1]);
    const tree = onChange.mock.calls.pop().pop();
    const rule = getRuleByPath(tree.rules, findRulePathById(tree.rules, 'wg9hlv197c'));

    expect(rule.value).toEqual('100');
    expect(rule.logic).toEqual('GT');
    expect(rule.column).toEqual('column2');

    const group = getRuleByPath(tree.rules, findRulePathById(tree.rules, 'qzn8477mbg'));
    expect(group.groupLogic).toEqual('ANY');
  });
});
