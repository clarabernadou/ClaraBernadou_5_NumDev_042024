describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  });

  it('Login not successfull because bad email', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        error: 'An error occurred',
      },
      statusCode: 400,
    }).as('login');

    cy.get('input[formControlName=email]').type("yogaa@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.wait('@login');

    cy.url().should('not.include', '/sessions');

    cy.contains('An error occurred').should('exist');
  });

  it('Login not successfull because bad password', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        error: 'An error occurred',
      },
      statusCode: 400,
    }).as('login');

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!12344"}{enter}{enter}`)

    cy.wait('@login');

    cy.url().should('not.include', '/sessions');

    cy.contains('An error occurred').should('exist');
  });

  it('Login not successfull because bad email and password', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        error: 'An error occurred',
      },
      statusCode: 400,
    }).as('login');

    cy.get('input[formControlName=email]').type("yogaa@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!12344"}{enter}{enter}`)

    cy.wait('@login');

    cy.url().should('not.include', '/sessions');

    cy.contains('An error occurred').should('exist');
  });
});