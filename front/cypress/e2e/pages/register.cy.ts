describe('Register spec', () => {
    it('Register page', () => {
        cy.visit('/register')

        cy.get('.mat-card-title').contains('Register').should('exist')
        cy.get('input[formControlName=firstName]').should('exist')
        cy.get('input[formControlName=lastName]').should('exist')
        cy.get('input[formControlName=email]').should('exist')
        cy.get('input[formControlName=password]').should('exist')
        cy.get('button').contains('Submit').should('exist')
    });

    it('Register successfull', () => {
        cy.visit('/register')

        cy.intercept('POST', '/api/auth/register', {
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

        cy.get('input[formControlName=firstName]').type("Toto")
        cy.get('input[formControlName=lastName]').type("Yoga")
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.url().should('include', '/login')
    });

    it('Register not successfull because email has already been used', () => {
        cy.visit('/register')

        cy.intercept('POST', '/api/auth/register', {
            body: {
              error: 'An error occurred',
            },
            statusCode: 409,
        }).as('register');

        cy.get('input[formControlName=firstName]').type("Toto")
        cy.get('input[formControlName=lastName]').type("Yoga")
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.url().should('not.include', '/login')
    });
  });