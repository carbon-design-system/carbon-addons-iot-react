// https://github.com/dmtrKovalenko/cypress-real-events
import 'cypress-real-events/support';
import '@cypress/code-coverage/support';

import '../../src/styles.scss';
import './commands';

Cypress.Screenshot.defaults({ capture: 'fullPage' });

after(() => {
  cy.task('generateReport');
});
