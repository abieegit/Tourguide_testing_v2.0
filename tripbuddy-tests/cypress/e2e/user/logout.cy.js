describe('Phase 10: Session & Logout Management', () => {

  it('TC-SL1: User logout clears session and redirects home', () => {
    // Login first
    cy.visit('/userlogin')
    cy.get('input[name="email"]').type('testuser@tripbuddy.com')
    cy.get('input[name="password"]').type('123123')
    cy.on('window:alert', () => true)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/deals')

    // Now logout using navbar button
    cy.get('.test-user-logout-button').click()

    // Should redirect to home
    cy.url().should('eq', Cypress.config('baseUrl') + '/')

    // Session should be cleared
    cy.window().then((win) => {
      expect(win.localStorage.getItem('isLoggedIn')).to.be.null
      expect(win.localStorage.getItem('user')).to.be.null
    })
  })

  it('TC-SL2: After logout login button reappears in navbar', () => {
    cy.visit('/userlogin')
    cy.get('input[name="email"]').type('testuser@tripbuddy.com')
    cy.get('input[name="password"]').type('123123')
    cy.on('window:alert', () => true)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/deals')

    cy.get('.test-user-logout-button').click()
    cy.get('.test-user-login-button').should('be.visible')
  })

  it('TC-SL3: Session persists after browser refresh', () => {
    cy.visit('/userlogin')
    cy.setUserSession()
    cy.visit('/deals')
    cy.reload()
    // After refresh, welcome message should still show
    cy.get('.test-user-welcome-message').should('be.visible')
  })

  it('TC-SL4: Admin logout clears admin session', () => {
    cy.visit('/admin')
    cy.get('input#username').type('admin')
    cy.get('input#password').type('123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')

    // Click admin logout button
    cy.get('.test-admin-desktop-logout').first().click()
    cy.url().should('include', '/admin')

    // Admin session cleared
    cy.window().then((win) => {
      expect(win.localStorage.getItem('tb_is_admin')).to.be.null
    })
  })

})