describe('Login spec', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth', { fixture: 'user.json' })
    })

  it('Check login component', () => {
    cy.visit('/login')

    cy.get('mat-card').should('exist')

    cy.get('mat-card-header').should('exist')
    cy.get('.mat-card-title').contains('Login').should('exist')

    cy.get('form').should('exist')
    cy.get('mat-card-content').should('exist')
    cy.get('mat-form-field').should('have.length', 2)

    cy.get('input[formControlName=email]').should('exist')
    cy.get('input[formControlName=password]').should('exist')

    cy.get('button[mat-icon-button]').contains('visibility_off').should('exist');
    cy.get('button[mat-icon-button]').contains('visibility').click();
    cy.get('button[mat-icon-button]').contains('visibility').should('exist');

    cy.get('button').contains('Submit').should('exist')
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Login not successful because bad email', () => {
    cy.visit('/login');

    const user = {
      email: 'totoo@test.com',
      password: 'test!1234',
    };

    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply({
        statusCode: 401,
        body: { error: 'Bad credentials' },
      });
    });

    cy.get('input[formControlName=email]').type(user.email);
    cy.get('input[formControlName=password]').type(user.password);
    cy.get('button').contains('Submit').click();

    cy.fixture('user.json').then(users => {
      const foundUser = users.find(u => u.email === user.email);
      expect(foundUser).to.not.exist;
    });

    cy.url().should('not.include', '/sessions');

    cy.get('p').contains('An error occurred').should('exist');
  });

  it('Login not successful because bad password', () => {
    cy.visit('/login');

    const user = {
      email: 'toto@test.com',
      password: 'test!12345',
    };

    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply({
        statusCode: 401,
        body: { error: 'Bad credentials' },
      });
    });

    cy.get('input[formControlName=email]').type(user.email);
    cy.get('input[formControlName=password]').type(user.password);
    cy.get('button').contains('Submit').click();

    cy.fixture('user.json').then(users => {
      const foundUser = users.find(u => u.email === user.email);
      expect(foundUser).to.exist;
      expect(foundUser.email).to.equal(user.email);
    });

    cy.url().should('not.include', '/sessions');

    cy.get('p').contains('An error occurred').should('exist');
  });

  it('Login not successful because bad email and password', () => {
    cy.visit('/login');

    const user = {
      email: 'totoo@test.com',
      password: 'test!12345',
    };

    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply({
        statusCode: 401,
        body: { error: 'Bad credentials' },
      });
    });

    cy.get('input[formControlName=email]').type(user.email);
    cy.get('input[formControlName=password]').type(user.password);
    cy.get('button').contains('Submit').click();

    cy.fixture('user.json').then(users => {
      const foundUser = users.find(u => u.email === user.email);
      expect(foundUser).to.not.exist;
    });

    cy.url().should('not.include', '/sessions');

    cy.get('p').contains('An error occurred').should('exist');
  });

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

    cy.fixture('user.json').then(users => {
      const foundUser = users.find(u => u.email === user.email);
      expect(foundUser).to.exist;
      expect(foundUser.email).to.equal(user.email);
    });

    cy.url().should('include', '/sessions')
  });
});