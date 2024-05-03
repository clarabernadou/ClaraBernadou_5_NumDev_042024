describe('Session spec', () => {
  // HERE
  beforeEach(() => {
    cy.intercept('GET', '/api/teacher', { statusCode: 200, body:
      {
        "teachers": [
          {
            "id": 1,
            "lastName": "Doe",
            "firstName": "John",
            "createdAt": "2022-05-01T10:00:00Z",
            "updatedAt": "2022-05-01T10:00:00Z"
          },
          {
            "id": 2,
            "lastName": "Smith",
            "firstName": "Jane",
            "createdAt": "2022-05-02T10:00:00Z",
            "updatedAt": "2022-05-02T10:00:00Z"
          }
        ]
      }
    }).as('getTeachers');
  });

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

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  });

  it('Create session with successful', () => {
    cy.get('span').contains('Create').click()
    cy.get('input[formControlName=name]').type('Yoga');
    cy.get('input[formControlName=date]').type('2024-05-01');

    // HERE
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').should('have.length', 2);

    cy.get('input[formControlName=description]').type('Yoga session');
    cy.get('span').contains('Save').click();
  });  
});
