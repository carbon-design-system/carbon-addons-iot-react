const chalk = require('chalk');

// colored text constants
const errorText = chalk.bold.red;
const warningText = chalk.yellow;
const urlText = chalk.underline.cyan;
const titleText = chalk.bgYellow;
const numberedText = chalk.dim;
const ruleNameText = chalk.bgWhite.black;

/*
 * filterForErrors: filters out elements in the results array that don't have errors
 */
function filterForErrors(result) {
  return result.errored;
}

/*
 * generateErrorIcon: generates a custom error or warning text depending on the severity of the error
 */
function generateErrorIcon(severity) {
  let errorIcon = '';
  switch (severity) {
    case 'error':
      errorIcon = errorText('ERROR');
      break;
    case 'warning':
      errorIcon = warningText('warning');
      break;
    default:
      errorIcon += '';
      break;
  }
  return errorIcon;
}

/*
 * formatTabbing: controls how many tabs are in between the location and the rule depending on how long the location is
 */
function formatTabbing(error) {
  if (`${error.line}:${error.column}`.length < 6) {
    return '\t \t';
  }
  return '\t';
}

/*
 * createCustomMessage: returns a custom message with a link to the carbon documentation depending on what the error is
 */
function createCustomMessage(text) {
  let message;
  if (text.includes('color"')) {
    const url = urlText('https://www.carbondesignsystem.com/guidelines/color/usage');
    message = `\n\t${text}\n\t> Please refer to the Carbon documentation for proper color tokens: ${url}`;
  } else if (text.includes('"margin') || text.includes('"padding')) {
    const url = urlText('https://www.carbondesignsystem.com/guidelines/spacing#spacing-scale');
    message = `\n\t${text}\n\t> Please refer to the Carbon documentation for proper spacing values: ${url}`;
  } else if (text.includes('"font')) {
    const url = urlText('https://www.carbondesignsystem.com/guidelines/typography/productive');
    message = `\n\t${text}\n\t> Please refer to the Carbon productive typography documentation for proper font values: ${url}`;
  } else if (text.includes('transition')) {
    const url = urlText('https://www.carbondesignsystem.com/guidelines/motion/overview');
    message = `\n\t${text}\n\t> Please refer to the Carbon motion documentation for transitions: ${url}`;
  }
  return message;
}

/*
 * formatError: formats the error message
 */
function formatError(errors) {
  let errorMsg = '';
  errors.forEach((error, i) => {
    const number = numberedText(`${i + 1}.`);
    errorMsg += `${number} \t${generateErrorIcon(error.severity)} \t ${error.line}:${
      error.column
    } ${formatTabbing(error)} ${ruleNameText(error.rule)} \n \t${createCustomMessage(
      error.text
    )}\n\n`;
  });

  return errorMsg;
}

/**
 * @type {import('stylelint').Formatter}
 */
function formatter(results) {
  let formattedMsg = titleText('\n!! WARNINGS !!\n\n');
  const filesWithErrors = results.filter(filterForErrors);
  filesWithErrors.forEach(result => {
    const errors = result.warnings;
    const errorMessage = formatError(errors);
    formattedMsg += chalk.bold('Source: ');
    formattedMsg += `${result.source} \n`;
    formattedMsg += `${errorMessage} \n `;
  });

  return formattedMsg;
}

module.exports = formatter;
