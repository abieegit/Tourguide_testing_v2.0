describe('Phase 8: Security / Unauthorized Access', () => {

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('TC-SEC1: Unauthenticated user visiting /my-bookings redirects to login', () => {
    cy.visit('/my-bookings')
    cy.url().should('include', '/userlogin')
  })

  it('TC-SEC2: Unauthenticated user visiting /dashboard redirects to admin login', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/admin')
  })

  it('TC-SEC3: Contact form requires login to submit', () => {
    cy.visit('/contactus')
    cy.get('input[name="name"]').type('Test')
    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="subject"]').type('Test')
    cy.get('textarea[name="message"]').type('Test message')
    cy.on('window:alert', (text) => {
      expect(text).to.include('Please login')
    })
    cy.get('[data-testid="contact-submit-btn"]').click()
    cy.url().should('include', '/userlogin')
  })

  it('TC-SEC4: Booking requires login', () => {
    cy.visit('/deals')
    cy.get('h3', { timeout: 10000 }).should('be.visible')
    cy.on('window:alert', (text) => {
      expect(text).to.include('Please login')
    })
    cy.get('[data-testid="book-now-btn"]').first().click()
    cy.url().should('include', '/userlogin')
  })

})