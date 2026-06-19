describe('TC-05: Book a Tour', () => {

  beforeEach(() => {
    cy.visit('/userlogin')
    cy.setUserSession()
    cy.visit('/deals')
  })

  it('TC-05: Should successfully book a deal when logged in', () => {
    cy.get('h3', { timeout: 10000 }).should('be.visible')
    cy.on('window:alert', (text) => {
      expect(text).to.exist
    })
    cy.get('[data-testid="book-now-btn"]').first().click()
  })

  it('TC-05b: Should redirect to login if not logged in', () => {
    cy.clearLocalStorage()
    cy.visit('/deals')
    cy.get('h3', { timeout: 10000 }).should('be.visible')
    cy.on('window:alert', (text) => {
      expect(text).to.include('Please login')
    })
    cy.get('[data-testid="book-now-btn"]').first().click()
    cy.url().should('include', '/userlogin')
  })

})