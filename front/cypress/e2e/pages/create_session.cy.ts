describe('Account spec', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/teacher', { fixture: 'teacher.json' })
    })

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

    it('Create a session', () => {
        cy.get('span').contains('Create').click()

        cy.get('input[formControlName=name]').type('Yoga')
        cy.get('input[formControlName=date]').type('2024-05-06')
        cy.get('mat-select[formControlName="teacher_id"]').click();
        cy.get('mat-option').should('have.length', 2);
        cy.get('mat-option').contains('Margot DELAHAYE').click()
        cy.get('textarea[formControlName=description]').type('A yoga session')

        cy.get('span').contains('Save').click()
        cy.url().should('include', '/sessions')
    })
});