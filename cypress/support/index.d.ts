// cypress/support/index.d.ts

declare namespace Cypress {
  interface Chainable {
    /**
     * Кастомная команда для перетаскивания элемента
     * @example cy.get('source').dragTo('target')
     */
    dragTo(target: string): Chainable<JQuery<HTMLElement>>
  }
}