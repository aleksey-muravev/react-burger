describe('Конструктор бургеров', () => {
  const testUser = {
    email: 'test-user@example.com',
    password: 'strongpassword123'
  };

  before(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { 
      success: true,
      name: "Space бургер",
      order: { number: 12345 }
    }).as('createOrder');
  });

  it('Полный цикл: авторизация → сборка → заказ', () => {
    // 1. Авторизация (прямой переход на страницу логина)
    cy.visit('/#/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button').contains('Войти').click();
    cy.location('hash').should('eq', '#/');

    // 2. Ждем загрузки ингредиентов
    cy.wait('@getIngredients');

    // 3. Собираем бургер (используем оригинальные селекторы)
    const dragIngredient = (name: string) => {
      const dataTransfer = new DataTransfer();
      
      cy.get('[data-testid^="ingredient-"]')
        .contains(name)
        .first()
        .trigger('dragstart', { dataTransfer });

      cy.get('[class*="BurgerConstructor_container"]')
        .trigger('dragover', { dataTransfer })
        .trigger('drop', { dataTransfer });
    };

    dragIngredient('Краторная булка');
    dragIngredient('Биокотлета');

    // 4. Оформляем заказ
    cy.get('button').contains('Оформить заказ')
      .should('not.be.disabled')
      .click();

    // 5. Проверяем модальное окно заказа
    cy.wait('@createOrder');
    cy.get('[class*="Modal_modal"]', { timeout: 10000 }).should('be.visible');
    
    // 6. Проверяем содержимое модального окна
    cy.get('[class*="Modal_modal"]').within(() => {
      cy.get('[class*="orderNumber"]').should('contain', '12345');
      cy.contains('Ваш заказ начали готовить').should('exist');
    });
  });
});