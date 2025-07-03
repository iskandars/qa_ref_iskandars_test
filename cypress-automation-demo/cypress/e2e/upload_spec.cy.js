describe('Demo UI Automation - TestAutomationPractice', () => {
  const url = 'https://testautomationpractice.blogspot.com/';

  beforeEach(() => {
    cy.visit(url);
  });

  it('Submits dummy registration form', () => {
    cy.get('#name').type('Saleh QA');
    cy.get('#email').type('saleh@example.com');
    cy.get('#phone').type('08123456789');
    cy.get('#textarea').type('This is a dummy registration for testing.');
    cy.get('#male').check(); // Gender radio
    cy.get('#sunday').check(); // Day checkbox
    cy.get('#country').select('India');
    cy.get('#colors').select('Red');
    cy.get('#datepicker').should('be.visible'); // Ensure datepicker is visible
  });

  it('Selects a date from the date picker', () => {
    cy.get('#datepicker').click();
    cy.get('.ui-datepicker-calendar').contains('15').click(); // Select 15th of the month
    cy.get('#datepicker').should('have.value', '07/15/2025');
  });

  it('Uploads a file', () => {
    const fileName = 'sample.jpg'; // Place this file in cypress/fixtures
    cy.get('#singleFileStatus', { timeout: 4000 }).attachFile(fileName);
  });
});