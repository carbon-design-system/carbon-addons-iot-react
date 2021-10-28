import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
  id: expect.stringMatching(/[a-zA-Z0-9]/),
  columnId: '',
  value: '',
  operand: '',
});

const TEST_TREE_DATA = {
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
              operand: '',
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
describe('RuleBuilderEditor', () => {
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
        id: expect.stringMatching(/[a-zA-Z0-9]/),
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
    userEvent.click(screen.getAllByText('Select a column')[0]);
    userEvent.click(screen.getAllByText('Column 2')[2]);
    userEvent.click(screen.getAllByText('Not equal')[0]);
    userEvent.click(screen.getAllByText('Greater than')[0]);
    userEvent.click(screen.getAllByText('ALL')[1]);
    userEvent.click(screen.getAllByText('ANY')[1]);
    const tree = onChange.mock.calls.pop().pop();
    const rule = getRuleByPath(tree.rules, findRulePathById(tree.rules, 'wg9hlv197c'));

    expect(rule.value).toEqual('100');
    expect(rule.operand).toEqual('GT');
    expect(rule.columnId).toEqual('column2');

    const group = getRuleByPath(tree.rules, findRulePathById(tree.rules, 'qzn8477mbg'));
    expect(group.groupLogic).toEqual('ANY');
  });

  it('rendered custom fields and operands', async () => {
    const onChange = jest.fn();
    const range = [];
    render(
      <RuleBuilderEditor
        defaultRules={{
          id: '14p5ho3pcu',
          groupLogic: 'ALL',
          rules: [
            {
              id: 'rsiru4rjba',
              columnId: 'column2',
              operand: 'EQ',
              value: '45',
            },
          ],
        }}
        columns={[
          {
            id: 'column1',
            name: 'Date',
            operands: [
              { id: 'before', name: 'Before' },
              { id: 'after', name: 'After' },
              {
                id: 'between',
                name: 'Between',
                renderField: ({ value, onChange }) => {
                  return (
                    <>
                      <input
                        data-testid="column1-date-input-1"
                        type="date"
                        defaultValue={value}
                        onChange={(e) => {
                          range[0] = e.target.value;
                          onChange(range);
                        }}
                      />
                      <input
                        data-testid="column1-date-input-2"
                        type="date"
                        defaultValue={value}
                        onChange={(e) => {
                          range[1] = e.target.value;
                          onChange(range);
                        }}
                      />
                    </>
                  );
                },
              },
            ],
          },
          {
            id: 'column2',
            name: 'Integer',
            renderField: ({ value, onChange }) => (
              <input
                data-testid="column2-number-input"
                type="number"
                defaultValue={value}
                onChange={(e) => onChange(e.target.value)}
              />
            ),
          },
          {
            id: 'column3',
            name: 'HTML Input',
            operands: [{ id: 'includes', name: 'Includes' }],
            renderField: ({ value, onChange }) => (
              <input
                data-testid="column3-text-input"
                type="text"
                defaultValue={value}
                onChange={(e) => onChange(e.target.value)}
              />
            ),
          },
        ]}
        onChange={onChange}
      />
    );
    expect((await screen.findAllByText('Add rule')).length).toEqual(1);
    const columnTwoInput = screen.getByTestId('column2-number-input');
    expect(columnTwoInput).toHaveAttribute('type', 'number');
    expect(columnTwoInput).toHaveValue(45);
    userEvent.click(screen.getByText('Add rule'));
    userEvent.click(screen.getAllByText(/select a column/i)[0]);
    userEvent.click(screen.getAllByText('HTML Input')[0]);
    const columnThreeInput = screen.getByTestId('column3-text-input');
    userEvent.type(columnThreeInput, 'asdf');
    expect(columnThreeInput).toHaveAttribute('type', 'text');
    expect(columnThreeInput).toHaveValue('asdf');
    userEvent.click(screen.getByText('Add rule'));
    userEvent.click(screen.getAllByText(/select a column/i)[0]);
    userEvent.click(screen.getAllByText('Date')[0]);
    userEvent.click(screen.getAllByText(/before/i)[0]);
    userEvent.click(screen.getAllByText(/between/i)[0]);
    const columnOneInputOne = screen.getByTestId('column1-date-input-1');
    fireEvent.focus(columnOneInputOne);
    fireEvent.change(columnOneInputOne, { target: { value: '2021-01-01' } });
    expect(columnOneInputOne).toHaveAttribute('type', 'date');
    expect(columnOneInputOne).toHaveValue('2021-01-01');
    const columnOneInputTwo = screen.getByTestId('column1-date-input-2');
    fireEvent.focus(columnOneInputTwo);
    fireEvent.change(columnOneInputTwo, { target: { value: '2021-02-01' } });
    expect(columnOneInputTwo).toHaveAttribute('type', 'date');
    expect(columnOneInputTwo).toHaveValue('2021-02-01');
    expect(onChange).toBeCalled();
    expect(onChange.mock.calls.pop().pop()).toEqual({
      id: '14p5ho3pcu',
      groupLogic: 'ALL',
      rules: [
        {
          id: 'rsiru4rjba',
          columnId: 'column2',
          operand: 'EQ',
          value: '45',
        },
        {
          id: expect.stringMatching(/[a-zA-Z0-9]/),
          columnId: 'column3',
          operand: 'includes',
          value: 'asdf',
        },
        {
          id: expect.stringMatching(/[a-zA-Z0-9]/),
          columnId: 'column1',
          operand: 'between',
          value: expect.arrayContaining(['2021-01-01', '2021-02-01']),
        },
      ],
    });
  });

  it('should call the default onChange when none given', () => {
    jest.spyOn(RuleBuilderEditor.defaultProps, 'onChange');
    const { container } = render(<RuleBuilderEditor columns={columns} />);

    expect(screen.getByTestId('rule-builder-editor')).toBeDefined();
    expect(container.querySelectorAll(`.${iotPrefix}--rule-builder-rule`).length).toEqual(1);
    const groupLogic = screen.getByText('ALL');
    expect(groupLogic).toBeDefined();
    userEvent.click(groupLogic);
    userEvent.click(screen.getAllByText('ANY')[0]);

    expect(RuleBuilderEditor.defaultProps.onChange).toBeCalledTimes(1);
    expect(RuleBuilderEditor.defaultProps.onChange).toBeCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(/[a-zA-Z0-9]/),
        groupLogic: 'ANY',
        rules: expect.arrayContaining([NEW_RULE_MATCH]),
      })
    );
    jest.resetAllMocks();
  });
});
