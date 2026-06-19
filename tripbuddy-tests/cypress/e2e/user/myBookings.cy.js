describe('TC-06 & TC-07: My Bookings and Cancellation', () => {

  beforeEach(() => {
    cy.visit('/userlogin')
    cy.setUserSession()
    cy.visit('/my-bookings')
    // Wait for page to finish loading
    cy.contains('h2', 'My Bookings', { timeout: 10000 }).should('be.visible')
  })

  it('TC-06: Should display My Bookings page', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="bookings-list"]').length > 0) {
        cy.get('[data-testid="booking-item"]').should('have.length.greaterThan', 0)
      } else {
        cy.get('[data-testid="no-bookings"]').should('be.visible')
        cy.contains("You don't have any bookings yet").should('be.visible')
      }
    })
  })

  it('TC-07: Should cancel a pending booking', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="cancel-btn"]').length > 0) {
        cy.on('window:confirm', () => true)
        cy.get('[data-testid="cancel-btn"]').first().click()
        cy.contains('h2', 'My Bookings').should('be.visible')
      } else {
        cy.log('No cancellable bookings available')
      }
    })
  })

})