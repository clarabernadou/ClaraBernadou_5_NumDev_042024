describe('Session list component', () => {
    const user = { id: 1, email: 'toto@test.com', password: 'test!1234', admin: false }

    beforeEach(() => {
        cy.intercept('GET', '/api/session', { fixture: 'sessions.json' });

        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: user.id,
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

        cy.url().should('include', '/sessions');
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