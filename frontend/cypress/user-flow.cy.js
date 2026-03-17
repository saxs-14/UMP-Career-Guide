describe('UCAG User Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should calculate APS and display qualifying courses', () => {
    // Select subjects and enter percentages
    cy.get('select[name="subject-0"]').select('Mathematics');
    cy.get('input[name="mark-0"]').type('75');
    cy.get('select[name="subject-1"]').select('English Home Language');
    cy.get('input[name="mark-1"]').type('80');
    cy.get('select[name="subject-2"]').select('Physical Sciences');
    cy.get('input[name="mark-2"]').type('70');
    // Add more subjects until at least 6

    cy.get('button[type="submit"]').click();

    // Check APS displayed
    cy.contains('Your APS:').should('be.visible');
    // Check course cards
    cy.get('.course-card').should('have.length.greaterThan', 0);

    // Filter by faculty
    cy.get('select[aria-label="Filter by faculty"]').select('Faculty of Agriculture and Natural Sciences');
    cy.get('.course-card').each(($card) => {
      cy.wrap($card).contains('Faculty of Agriculture and Natural Sciences');
    });

    // Click view details (if implemented)
    cy.get('.course-card button').first().click();
    cy.get('.modal').should('be.visible');
    cy.contains('Course Details').should('be.visible');
  });
});
