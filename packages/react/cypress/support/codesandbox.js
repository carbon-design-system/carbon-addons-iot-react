import '@testing-library/cypress/add-commands';

// https://www.nicknish.co/blog/cypress-targeting-elements-inside-iframes
Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => {}) => {
  // For more info on targeting inside iframes refer to this GitHub issue:
  // https://github.com/cypress-io/cypress/issues/136
  cy.log('Getting iframe body');

  return (
    cy
      .wrap($iframe)
      // eslint-disable-next-line jest/no-standalone-expect
      .should((iframe) => expect(iframe.contents().find('body')).to.exist)
      .then((iframe) => cy.wrap(iframe.contents().find('body')))
      .within({}, callback)
  );
});
