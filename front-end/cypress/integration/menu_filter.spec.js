describe('Menu Filter Functionality Test', () => {
  it('should filter menu items when a menu filter button is clicked', () => {
    cy.visit('http://localhost:8080')
    // Replace '.menu-item' with the actual class or element that represents a menu item
    // Add assertions to check if the filtering works as expected
    cy.get('.menu-filter-btn button').contains('Pizza').click()
    cy.get('.box').should('contain', 'Pizza')
  })
})