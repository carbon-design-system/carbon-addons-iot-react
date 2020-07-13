const chalk = require('chalk');

/**
 * @constant
 */
const TITLE = chalk.bgYellow;
const ERROR = chalk.bold.red;
const WARNING = chalk.yellow;
const URL = chalk.underline.cyan;
const NUMBER = chalk.dim;
const RULE = chalk.bgWhite.black;

/**
 * returns the boolean representing whether a file has any errors for filtering purposes
 * @param {Object} result - the object representing the result of a linting session
 * @returns {Boolean} returns true or false depending on whether the file has errors or not
 */
function filterForErrors(result) {
  return result.errored;
}

/**
 * creates colored text that describes the severity of a problem
 * @param {String} severity - error.severity, the severity of the error
 * @returns {String} returns colored error text depending on the severity
 */
function generateErrorIcon(severity) {
  let errorIcon = '';
  switch (severity) {
    case 'error':
      errorIcon = ERROR('ERROR');
      break;
    case 'warning':
      errorIcon = WARNING('warning');
      break;
    default:
      errorIcon += '';
      break;
  }
  return errorIcon;
}

/**
 * indents a piece of text depending on the length of the previous block of text
 * @param {Object} error - the specific error
 * @returns {String} returns the appropriate amount of tab characters
 */
function formatTabbing(error) {
  if (`${error.line}:${error.column}`.length < 6) {
    return '\t \t';
  }
  return '\t';
}

/**
 * creates a message with a link to the carbon documentation depending on the individual error
 * @param {String} text - the error.text property of an error message, the defaul error message stylelint produces
 * @returns {String} returns a custom informational message for the type of error
 */
function createCustomMessage(text) {
  let message = '';
  if (text) {
    if (text.includes('color"')) {
      const url = URL('https://www.carbondesignsystem.com/guidelines/color/usage');
      message = `\n\t${text}\n\t> Please refer to the Carbon documentation for proper color tokens: ${url}`;
    } else if (text.includes('"margin') || text.includes('"padding')) {
      const url = URL('https://www.carbondesignsystem.com/guidelines/spacing#spacing-scale');
      message = `\n\t${text}\n\t> Please refer to the Carbon documentation for proper spacing values: ${url}`;
    } else if (text.includes('"font')) {
      const url = URL('https://www.carbondesignsystem.com/guidelines/typography/productive');
      message = `\n\t${text}\n\t> Please refer to the Carbon productive typography documentation for proper font values: ${url}`;
    } else if (text.includes('transition')) {
      const url = URL('https://www.carbondesignsystem.com/guidelines/motion/overview');
      message = `\n\t${text}\n\t> Please refer to the Carbon motion documentation for transitions: ${url}`;
    }
  }
  return message;
}

/**
 * formats the error message
 * @param {Array<object>} errors - an array of all the errors in the linting session
 * @returns {String} returns a formatted error message
 */

function formatError(errors) {
  let errorMsg = '';
  errors.forEach((error, i) => {
    const number = NUMBER(`${i + 1}.`);
    errorMsg += `${number} \t${generateErrorIcon(error.severity)} \t ${error.line}:${
      error.column
    } ${formatTabbing(error)} ${RULE(error.rule)}\n \t${createCustomMessage(error.text)}\n\n`;
  });

  return errorMsg;
}

/**
 * @type {import('stylelint').Formatter}
 */
function formatter(results) {
  let formattedMsg = '';
  if (results) {
    const filesWithErrors = results.filter(filterForErrors);
    if (filesWithErrors.length > 0) {
      formattedMsg += TITLE('\n!! WARNINGS !!\n\n');
    }
    filesWithErrors.forEach(result => {
      const errors = result.warnings;
      const errorMessage = formatError(errors);
      formattedMsg += chalk.bold('Source: ');
      formattedMsg += `${result.source}\n`;
      formattedMsg += `${errorMessage}\n`;
    });
  }
  return formattedMsg;
}

module.exports = formatter;
