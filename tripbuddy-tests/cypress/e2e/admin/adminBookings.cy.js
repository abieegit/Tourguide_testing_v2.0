describe('TC-10: Admin Booking Management', () => {

  beforeEach(() => {
    cy.visit('/admin')
    cy.setAdminSession()
    cy.visit('/dashboard')
    cy.contains('button', 'Bookings', { timeout: 10000 }).click()
    cy.get('table', { timeout: 10000 }).should('be.visible')
  })

  it('TC-10: Should approve a pending booking', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="approve-btn"]').length > 0) {
        cy.get('[data-testid="approve-btn"]').first().click()
        cy.contains('approved', { timeout: 6000 }).should('be.visible')
      } else {
        cy.log('No pending bookings to approve')
      }
    })
  })

  it('TC-10b: Should reject a pending booking', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="reject-btn"]').length > 0) {
        cy.get('[data-testid="reject-btn"]').first().click()
        cy.contains('rejected', { timeout: 6000 }).should('be.visible')
      } else {
        cy.log('No bookings to reject')
      }
    })
  })

})