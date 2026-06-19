describe('TC-09: Admin Login', () => {

  beforeEach(() => {
    cy.visit('/admin')
  })

  it('TC-09: Should login as admin and reach dashboard', () => {
    cy.get('input#username').should('be.visible').type('admin')
    cy.get('input#password').should('be.visible').type('123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
    cy.contains('Admin Panel').should('be.visible')
    cy.contains('button', 'Bookings').should('be.visible')
    cy.contains('button', 'Deals Management').should('be.visible')
  })

  it('TC-09b: Should show alert for invalid admin credentials', () => {
    cy.get('input#username').type('admin')
    cy.get('input#password').type('wrongpassword')
    cy.on('window:alert', (text) => {
      expect(text).to.include('Invalid')
    })
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin')
  })

  it('TC-09c: Should block access to dashboard without admin session', () => {
    cy.clearLocalStorage()
    cy.visit('/dashboard')
    cy.url().should('include', '/admin')
  })

})