describe('Update session spec', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/teacher', { fixture: 'teachers.json' });
        cy.intercept('GET', '/api/session', { fixture: 'sessions.json' });
        cy.intercept('GET', '/api/session/1', { fixture: 'session.json' });
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

      cy.get('span').contains('Edit').click()
    });
  
    it('Check update session page', () => {
        cy.url().should('include', '/sessions/update/1')

        cy.get('mat-card').should('exist')

        cy.get('mat-card-title').should('exist')
        cy.get('h1').contains('Update session').should('exist')

        cy.get('button').contains('arrow_back').should('exist')
        cy.get('button').contains('arrow_back').click()
        cy.url().should('include', '/sessions')

        // Return to the update session page
        cy.get('span').contains('Edit').click()

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
        cy.get('button[type="submit"]').should('not.be.disabled');

        cy.get('body').click()
    })

    it('Check session information', () => {
        cy.get('input[formControlName=name]').should('have.value', 'Yoga').should('exist')
        cy.get('input[formControlName=date]').should('have.value', '2024-05-01').should('exist')
        cy.get('mat-select[formControlName="teacher_id"]').should('contain', 'Margot DELAHAYE').should('exist')
        cy.get('textarea[formControlName=description]').should('have.value', 'Yoga session').should('exist')
    });

    it('Update session information', () => {
        cy.get('input[formControlName=date]').type('2024-05-09')
        cy.get('mat-select[formControlName="teacher_id"]').click();
        cy.get('mat-option').contains('Hélène THIERCELIN').click()

        cy.get('button[type="submit"]').should('not.be.disabled');
        cy.get('span').contains('Save').click()

        cy.url().should('include', '/sessions')
    })
});