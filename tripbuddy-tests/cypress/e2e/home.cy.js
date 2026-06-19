describe('Phase 1: Home Page Verification', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('TC-H1: Home page loads successfully', () => {
    cy.get('.test-home-hero-container').should('be.visible')
    cy.get('.test-home-hero-heading').should('contain.text', 'Your Next Adventure Awaits')
  })

  it('TC-H2: Explore Deals button navigates to deals page', () => {
    cy.get('.test-home-explore-deals-button').click()
    cy.url().should('include', '/deals')
  })

  it('TC-H3: Admin button in navbar navigates to admin login', () => {
    cy.get('.test-nav-admin-dashboard-link').click()
    cy.url().should('satisfy', (url) => 
      url.includes('/dashboard') || url.includes('/admin')
    )
  })

  it('TC-H4: Login button in navbar navigates to login page', () => {
    cy.get('.test-user-login-button').click()
    cy.url().should('include', '/userlogin')
  })

})