const formatter = require('./sassMsgFormatter');
const chalk = require('chalk');

const ERROR = chalk.bold.red;
const WARNING = chalk.yellow;
const URL = chalk.underline.cyan;
const TITLE = chalk.bgYellow;

const exampleOne = {
  source: 'test1.js',
  errored: true,
  warnings: [
    {
      severity: 'error',
      line: 21,
      column: 33,
      rule: 'declaration-property-unit-blacklist',
      text: 'Unexpected value in property "color"',
    },
  ],
};
const exampleTwo = {
  source: 'test2.js',
  errored: true,
  warnings: [
    {
      severity: 'error',
      line: 123,
      column: 76,
      rule: 'declaration-property-value-blacklist',
      text: 'Unexpected value in "font-family"',
    },
  ],
};
const exampleThree = {
  source: 'test1.js',
  errored: true,
  warnings: [
    {
      severity: 'error',
      line: 21,
      column: 33,
      rule: 'declaration-property-unit-blacklist',
      text: 'Unexpected value in property "color"',
    },
  ],
};

describe('sassMsgFormatter', () => {
  it('filters for errors', () => {
    // this function should return false unless errored is equal to true
    expect(formatter.filterForErrors({ errored: undefined })).toBeFalsy();
    expect(formatter.filterForErrors({ errored: true })).toBeTruthy();
    expect(formatter.filterForErrors({ errored: false })).toBeFalsy();
    expect(formatter.filterForErrors({ errored: null })).toBeFalsy();
  });
  it('filters duplicates', () => {
    expect(formatter.filterDuplicates([exampleOne, exampleOne])).toMatchObject([exampleOne]);
    expect(formatter.filterDuplicates([exampleOne, exampleTwo])).toMatchObject([
      exampleOne,
      exampleTwo,
    ]);
    expect(formatter.filterDuplicates([exampleOne, exampleThree])).toMatchObject([exampleOne]);
  });
  it('generates error icons', () => {
    // expect(generateErrorIcon('error')).toEqual(ERROR('ERROR'));
    expect(formatter.generateErrorIcon('error')).toContain('ERROR');
    expect(formatter.generateErrorIcon('warning')).toContain('warning');
    expect(formatter.generateErrorIcon(undefined)).toHaveLength(0);
  });
  it('formats tabbing', () => {
    expect(formatter.formatTabbing({ line: 121, column: 23 })).toHaveLength(1);
    expect(formatter.formatTabbing({ line: 1, column: 123 })).toHaveLength(3);
    expect(formatter.formatTabbing({ line: 14, column: 23 })).toHaveLength(3);
  });
  it('creates custom message', () => {
    console.log(exampleOne.warnings[0].text);
    expect(createCustomMessage(exampleOne.warnings[0].text)).toContain(
      URL('https://www.carbondesignsystem.com/guidelines/color/usage')
    );
    expect(createCustomMessage(exampleTwo.warnings[0].text)).toContain(
      URL('https://www.carbondesignsystem.com/guidelines/typography/productive')
    );
    expect(createCustomMessage(null)).toHaveLength(0);
  });
  it('formats errors', () => {
    expect(formatter.formatError(exampleOne.warnings)).toContain(ERROR('ERROR'));
    expect(formatter.formatError(exampleTwo.warnings)).toContain(ERROR('ERROR'));
    expect(
      formatError([
        {
          severity: 'warning',
          line: 123,
          column: 45,
          rule: 'insert-rule-here',
          text: 'error text',
        },
      ])
    ).toContain(WARNING('warning'));
  });
  it('formats message', () => {
    const resultsTest = [exampleOne, exampleTwo, { errored: false, warnings: undefined }];
    expect(resultsTest.filter(formatter.filterForErrors)).toHaveLength(2);
    expect(formatter(resultsTest)).toContain(TITLE('\n!! WARNINGS !!\n\n'));
    expect(formatter(resultsTest)).toContain(formatError(exampleOne.warnings));
    expect(formatter(resultsTest)).toContain(formatError(exampleTwo.warnings));
    expect(formatter([{ errored: false, warnings: undefined }])).toMatch('');
    expect(formatter(null)).toHaveLength(0);
  });
});
