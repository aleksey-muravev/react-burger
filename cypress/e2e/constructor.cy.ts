describe('Конструктор бургеров', () => {
  const testUser = {
    email: 'test-user@example.com',
    password: 'strongpassword123'
  };

  before(() => {
    // Мокируем все необходимые API-запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: { email: testUser.email, name: 'Test User' }
      }
    }).as('login');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: "Space бургер",
        order: { number: 12345 }
      }
    }).as('createOrder');

    // Мок для обновления токена
    cy.intercept('POST', '**/api/auth/token', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'new-access-token'
      }
    }).as('refreshToken');
  });

  it('Полный цикл: авторизация → сборка → заказ', () => {
    // 1. Авторизация
    cy.visit('/#/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button').contains('Войти').click();
    cy.wait('@login');
    cy.location('hash').should('eq', '#/');

    // 2. Загрузка ингредиентов
    cy.wait('@getIngredients');

    // 3. Сборка бургера
    const dragIngredient = (name: string) => {
      cy.contains('[data-testid^="ingredient"]', name)
        .first()
        .trigger('dragstart', { dataTransfer: new DataTransfer() });
      
      cy.get('[class*="BurgerConstructor_container"]')
        .trigger('dragover')
        .trigger('drop');
    };

    dragIngredient('Краторная булка');
    dragIngredient('Биокотлета');

    // 4. Оформление заказа
    cy.get('button').contains('Оформить заказ')
      .should('be.enabled')
      .click();

    // 5. Проверка модального окна
    cy.wait('@createOrder', { timeout: 10000 });
    cy.get('[class*="Modal_modal"]', { timeout: 15000 }).should('be.visible');
    
    cy.get('[class*="Modal_modal"]').within(() => {
      cy.get('[class*="orderNumber"]').should('contain', '12345');
      cy.contains('Ваш заказ начали готовить').should('exist');
    });
  });
});