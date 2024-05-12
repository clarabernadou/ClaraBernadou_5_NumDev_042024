describe('App component spec', () => {
    it('Nav bar component not login', () => {
        cy.visit('/register')

        cy.get('span').contains('Yoga app').should('exist')
        cy.get('span').contains('Login').should('exist')
        cy.get('span').contains('Register').should('exist')

        cy.get('span').contains('Login').click()
        cy.url().should('include', '/login')

        cy.get('span').contains('Register').click()
        cy.url().should('include', '/register')
    });

    it('Nav bar component login', () => {
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

      cy.get('span').contains('Yoga app').should('exist')
      cy.get('span').contains('Sessions').should('exist')
      cy.get('span').contains('Account').should('exist')
      cy.get('span').contains('Logout').should('exist')

      cy.get('span').contains('Sessions').click()
      cy.url().should('include', '/sessions')

      cy.get('span').contains('Account').click()
      cy.url().should('include', '/me')

      cy.get('span').contains('Logout').click()
      cy.url().should('include', '/')
    });
});