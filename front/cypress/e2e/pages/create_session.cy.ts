describe('Create session spec', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/teacher', { fixture: 'teachers.json' })
    })

    it('Login successfull', () => {
      cy.visit('/login')
  
      const user = {
        email: 'toto@test.com',
        password: 'test!1234',
        admin: true,
      }
  
      cy.intercept('POST', '/api/auth/login', {
        body: {
          username: user.email,
          password: user.password,
          admin: user.admin,
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

      cy.get('span').contains('Create').click()
    });

    it('Check create session page', () => {
        cy.url().should('include', '/sessions/create')

        cy.get('mat-card').should('exist')

        cy.get('mat-card-title').should('exist')
        cy.get('h1').contains('Create session').should('exist')

        cy.get('button').contains('arrow_back').should('exist')
        cy.get('button').contains('arrow_back').click()
        cy.url().should('include', '/sessions')

        // Return to the create session page
        cy.get('span').contains('Create').click()

        cy.get('form').should('exist')
        cy.get('mat-form-field').should('have.length', 4)

        cy.get('input[formControlName=name]').should('exist')
        cy.get('input[formControlName=date]').should('exist')
        cy.get('mat-select[formControlName="teacher_id"]').should('exist')
        cy.get('mat-select[formControlName="teacher_id"]').click()
        cy.get('mat-option').should('have.length', 2);
        cy.get('mat-option').contains('Margot DELAHAYE').should('exist')
        cy.get('mat-option').contains('Hélène THIERCELIN').should('exist')
        cy.get('textarea[formControlName=description]').should('exist')

        cy.get('span').contains('Save').should('exist')
        cy.get('button[type="submit"]').should('be.disabled');

        cy.get('body').click()
    })

    it('Create session', () => {
        const session = {
          id: 3,
          name: "Test",
          date: "2024-05-09",
          teacher_id: 1,
          description: "Test",
          users: [],
          createdAt: "2024-05-09",
          updatedAt: "2024-05-09"
        }

        cy.get('input[formControlName=name]').type(session.name)
        cy.get('input[formControlName=date]').type(session.date)
        cy.get('mat-select[formControlName="teacher_id"]').click();
        cy.get('mat-option').contains('Margot DELAHAYE').click();
        cy.get('textarea[formControlName=description]').type(session.description)

        cy.get('button[type="submit"]').should('not.be.disabled');

        cy.intercept('POST', '/api/session', {
          body: session,
        });

        cy.get('span').contains('Save').click()
        cy.url().should('include', '/sessions')

        cy.get('.mat-simple-snackbar').should('exist')
        cy.get('span').contains('Session created !').should('exist')
        cy.get('button').contains('Close').should('exist')
    })
});