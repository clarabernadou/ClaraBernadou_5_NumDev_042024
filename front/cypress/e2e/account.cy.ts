describe('Account spec', () => {
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

    it('Show your account', () => {
        cy.get('span').contains('Account').click();
        cy.url().should('include', '/me');

        cy.get('h1').contains('User information');
    });

    it('Return in home page', () => {
        cy.get('.mat-icon').click();
        cy.url().should('include', '/sessions');
    });
});