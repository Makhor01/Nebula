describe('started', function () {

    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the main page', () => {
        cy.url().should('include', '/');
    });

    it('should navigate to Dashboard Page', () => {
        cy.visit('/dashboard');
        cy.url().should('include', '/dashboard');
    });

    it('should navigate to Calendar Page', () => {
        cy.visit('/calendar');
        cy.url().should('include', '/calendar');
    });

    it('should navigate to Kanban Page', () => {
        cy.visit('/kanban');
        cy.url().should('include', '/kanban');
    });

})