Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, targetSelector) => {
  const BUTTON_LEFT = 0;
  
  cy.wrap(subject)
    .trigger('mousedown', { button: BUTTON_LEFT, force: true })
    .trigger('dragstart', { force: true });

  cy.get(targetSelector)
    .trigger('mousemove', { clientX: 100, clientY: 100, force: true })
    .trigger('dragover', { force: true })
    .trigger('drop', { force: true });

  cy.wrap(subject)
    .trigger('mouseup', { force: true })
    .trigger('dragend', { force: true });
});