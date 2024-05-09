describe('Logout spec', () => {
  it('Login successfull', () => {
    cy.visit('/login')

    const user = {
      email: 'toto@test.com',
      password: 'test!1234',
    }

    cy.intercept('POST', '/api/auth/login', {
      body: {
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
  });

  it('Logout successful', () => {
    cy.get('span').contains('Logout').click();

    cy.url().should('include', '/');
  });
});