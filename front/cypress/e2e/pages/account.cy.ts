describe('Account spec', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/user/2', { fixture: 'user.json' });

    cy.visit('/login')

    const user = {
      id: 2,
      email: 'tata@test.com',
      password: 'test!1234',
    }

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: user.id,
        username: user.email,
        password: user.password,
      },
    });

    cy.get('input[formControlName=email]').type(user.email)
    cy.get('input[formControlName=password]').type(`${user.password}{enter}{enter}`)

    cy.fixture('users.json').then(users => {
      const foundUser = users.find(u => u.email === user.email);
      expect(foundUser).to.exist;
      expect(foundUser.email).to.equal(user.email);
    });

    cy.url().should('include', '/sessions')

    cy.get('span').contains('Account').click()

    cy.url().should('include', '/me')
  });

  it('Check account page', () => {
    cy.get('mat-card').should('exist')

    cy.get('mat-card-title').should('exist')
    cy.get('h1').contains('User information').should('exist');

    cy.get('button').contains('arrow_back').should('exist')
    cy.get('button').contains('arrow_back').click()
    cy.url().should('include', '/sessions')

    // Return to the create session page
    cy.get('span').contains('Account').click()

    cy.get('mat-card-content').should('exist')
    cy.get('p').should('have.length', 5)
  
    cy.get('p').contains('Delete my account:').should('exist')
    cy.get('button').contains('Detail').should('exist')
    cy.get('mat-icon').contains('delete').should('exist')

    cy.get('i').contains('Create at: ').should('exist')
    cy.get('i').contains('Last update: ').should('exist')
  });

    it('Check account informations', () => {
      cy.fixture('user.json').then(user => {
        cy.get('p').contains(`Name: ${user.firstName + ' ' + user.lastName.toUpperCase()}`)
        cy.get('p').contains(`Email: ${user.email}`)

        const formattedCreatedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const formattedUpdatedDate = new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        cy.get('p').contains(`Create at: ${formattedCreatedDate}`).should('exist');
        cy.get('p').contains(`Last update: ${formattedUpdatedDate}`).should('exist')
      })
    });

    it('Delete account', () => {
      cy.intercept('DELETE', '/api/user/2', {});
      cy.get('button').contains('Detail').click()

      cy.url().should('include', '/')

      cy.get('.mat-simple-snackbar').should('exist')
      cy.get('span').contains('Your account has been deleted !').should('exist')
      cy.get('button').contains('Close').should('exist')
    });
});