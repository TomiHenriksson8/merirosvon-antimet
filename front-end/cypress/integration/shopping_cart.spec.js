describe('Shopping Cart Modal Test', () => {
  it('should log in, close the success popup, add the first item to the shopping cart, and display items', () => {
    cy.visit('http://localhost:8080');
    // Open the login modal
    cy.get('#profile-icon').click();
    // Log in
    cy.get('.login-username').type('userfore2etest');
    cy.get('.login-password').type('newpassword');
    cy.get('#login-form').submit();
    // Wait for the success popup to appear
    cy.get('.popup-overlay.popup-lr-ok-container').should('be.visible');
    // Close the success popup
    cy.get('.close-e2e').click();
    // Wait for any animations or transitions to complete
    cy.wait(1000); 
    // Add an item to the cart
    cy.get('.add-to-cart').first().click();
    // Open the shopping cart modal
    cy.get('#cart-icon').click();
    cy.get('#shoppingCart').should('be.visible');
    // Check for the cart items and total
    cy.get('.cart-items').children().should('have.length.at.least', 1);
    cy.get('#cart-total').should('not.contain.text', '0.00€');
  });
});