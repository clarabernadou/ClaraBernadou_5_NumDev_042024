describe('Session list component', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/session', { fixture: 'sessions.json' });
        cy.intercept('GET', '/api/auth/login', { fixture: 'auth.json' });
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

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.fixture('users.json').then(users => {
          const foundUser = users.find(u => u.email === user.email);
          expect(foundUser).to.exist;
          expect(foundUser.email).to.equal(user.email);
        });

        cy.url().should('include', '/sessions')
    });

    it('Check session list page', () => {
        cy.get('mat-card').should('exist')
        cy.get('mat-card').should('have.length', 3)

        cy.get('mat-card-header').should('exist')
        cy.get('mat-card-header').should('have.length', 3)
        cy.get('mat-card-title').contains('Rentals available').should('exist')

        cy.fixture('sessions.json').then(sessions => {
            for(let session of sessions) {
                const date = new Date(session.date);
                const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                cy.get('mat-card-title').contains(session.name).should('exist')
                cy.get('mat-card-subtitle').should('contain', `Session on ${formattedDate}`);
                cy.get('.picture').should('have.attr', 'src', 'assets/sessions.png');
                cy.get('p').contains(session.description).should('exist')
                cy.get('mat-icon').contains('search').should('exist')
                cy.get('span').contains('Detail').should('exist')
            }
        })
    })
})