describe('App component spec', () => {
    it('Nav bar component', () => {
        cy.visit('/register')

        cy.get('span').contains('Yoga app').should('exist')
        cy.get('span').contains('Login').should('exist')
        cy.get('span').contains('Register').should('exist')

        cy.get('span').contains('Login').click()
        cy.url().should('include', '/login')

        cy.get('span').contains('Register').click()
        cy.url().should('include', '/register')
    });
});