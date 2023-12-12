describe('Profile Modal Opening Test', () => {
  it('should open the profile modal when the profile icon is clicked', () => {
    cy.visit('http://localhost:8080')
    cy.get('#profile-icon').click()
    cy.get('#profileModal').should('be.visible')
  })
})