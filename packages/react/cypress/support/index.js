// https://github.com/dmtrKovalenko/cypress-real-events
import 'cypress-real-events/support';
import '@cypress/code-coverage/support';

// https://github.com/testing-library/cypress-testing-library
import '@testing-library/cypress/add-commands';

import '../../src/styles.scss';
import './commands';

Cypress.Screenshot.defaults({ capture: 'fullPage' });

after(() => {
  cy.task('generateReport');
});
