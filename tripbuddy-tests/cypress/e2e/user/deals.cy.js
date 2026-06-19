describe('TC-04: Browse Travel Deals', () => {

  beforeEach(() => {
    cy.visit('/userlogin')
    cy.setUserSession()
    cy.visit('/deals')
  })

  it('TC-04: Should display deal cards with title, price and Book Now button', () => {
    // Wait for deals to load from API
    cy.get('h3', { timeout: 10000 }).should('be.visible')
    // Price text contains RS
    cy.contains('RS').should('be.visible')
    // Book Now button exists
    cy.contains('button', 'Book Now').should('be.visible')
  })

  it('TC-04b: Search should show validation for less than 2 characters', () => {
    cy.get('input[aria-label="Search deals"]', { timeout: 10000 }).type('a')
    cy.contains('Please enter at least 2 characters').should('be.visible')
  })

})