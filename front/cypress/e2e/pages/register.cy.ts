describe('Register spec', () => {
    it('Check register component', () => {
        cy.visit('/register')

        cy.get('mat-card').should('exist')

        cy.get('mat-card-header').should('exist')
        cy.get('.mat-card-title').contains('Register').should('exist')

        cy.get('form').should('exist')
        cy.get('mat-card-content').should('exist')
        cy.get('mat-form-field').should('have.length', 4)

        cy.get('input[formControlName=firstName]').should('exist')
        cy.get('input[formControlName=lastName]').should('exist')
        cy.get('input[formControlName=email]').should('exist')
        cy.get('input[formControlName=password]').should('exist')

        cy.get('button').contains('Submit').should('exist')
        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('Register successfull', () => {
        cy.visit('/register')

        const user = {
            email: 'toto@test.com',
            firstName: 'Toto',
            lastName: 'Test',
            admin: false
        }

        cy.intercept('POST', '/api/auth/register', {
            body: {
                email: user.email,
                firstName: user.firstName,
                lastName:  user.lastName,
                admin: user.admin
            },
        })

        cy.intercept(
            {
            method: 'GET',
            url: '/api/session',
            },
            []).as('session')

        cy.get('input[formControlName=firstName]').type(user.firstName)
        cy.get('input[formControlName=lastName]').type(user.lastName)
        cy.get('input[formControlName=email]').type(user.email)
        cy.get('input[formControlName=password]').type("test!1234")

        cy.get('button[type="submit"]').should('not.be.disabled');
        cy.get('span').contains('Submit').click()

        cy.url().should('include', '/login')
    });

    it('Register not successfull because email has already been used', () => {
        cy.visit('/register')

        const user = {
            email: 'toto@test.com',
            firstName: 'Toto',
            lastName: 'Test',
            admin: false
        }

        cy.intercept('POST', '/api/auth/register', {
            body: {
              error: 'An error occurred',
            },
            statusCode: 409,
        }).as('register');

        cy.get('input[formControlName=firstName]').type(user.firstName)
        cy.get('input[formControlName=lastName]').type(user.lastName)
        cy.get('input[formControlName=email]').type(user.email)
        cy.get('input[formControlName=password]').type("test!1234")

        cy.get('button[type="submit"]').should('not.be.disabled');
        cy.get('span').contains('Submit').click()

        cy.get('span').contains('An error occurred').should('exist');

        cy.url().should('not.include', '/login')
    });
  });