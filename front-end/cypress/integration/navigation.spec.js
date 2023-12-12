describe('Navigation Scroll Test', () => {
  it('should scroll to the correct page section when navigation link is clicked', () => {
    cy.visit('http://localhost:8080')
    cy.get('.navbar a[href="#menu"]').click()
    cy.get('#menu').should('be.visible')
  })
})