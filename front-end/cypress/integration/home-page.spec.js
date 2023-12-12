describe('Homepage Test', () => {
  it('successfully loads the homepage and checks for main elements', () => {
    // Replace with your web application's URL
    cy.visit('http://localhost:8080') 
    // Check for the logo container
    cy.get('.logo-container').should('exist')
    // Check for the main navigation
    cy.get('.navbar').should('exist')
    cy.get('.navbar').contains('Etusivu').should('be.visible')
    cy.get('.navbar').contains('Menu').should('be.visible')
    cy.get('.navbar').contains('Tietoa Meistä').should('be.visible')
    // Check for the existence of a profile link and cart icon
    cy.get('#profile-icon').should('exist')
    cy.get('#cart-icon').should('exist')
    // Check for the slider section
    cy.get('.slider').should('exist')
    cy.get('#slide-1').should('exist')
    cy.get('#slide-2').should('exist')
    cy.get('#slide-3').should('exist')
    // Check for the info section
    cy.get('.info').should('exist')
    // Check for the menu section
    cy.get('.menu').should('exist')
    cy.get('.menu-filter-btn').should('exist')
    // Check for the about us section
    cy.get('.about-us').should('exist')
    // Check for the footer
    cy.get('footer').should('exist')
  })
})
