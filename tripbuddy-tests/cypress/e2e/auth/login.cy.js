describe('Phase 1: Login Module', () => {

  beforeEach(() => {
    cy.visit('/userlogin')
  })

  it('TC-L1: Valid login redirects to deals page', () => {
    cy.get('input[name="email"]').type('ali@gmail.com')
    cy.get('input[name="password"]').type('123123')
    cy.on('window:alert', (text) => { expect(text).to.exist })
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/deals')
  })

  it('TC-L2: Invalid login shows error message', () => {
    cy.get('input[name="email"]').type('testuser@tripbuddy.com')
    cy.get('input[name="password"]').type('WrongPassword999')
    cy.get('button[type="submit"]').click()
    cy.get('.text-red-700').should('be.visible')
    cy.url().should('include', '/userlogin')
  })

  it('TC-L3: Empty email shows validation error', () => {
    cy.get('input[name="password"]').type('Test@1234')
    cy.get('button[type="submit"]').click()
    cy.get('.text-red-700').should('be.visible')
  })

  it('TC-L4: Session is created after login', () => {
    cy.get('input[name="email"]').type('ali@gmail.com')
    cy.get('input[name="password"]').type('123123')
    cy.on('window:alert', () => true)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/deals')
    // Verify localStorage session was created
    cy.window().then((win) => {
      expect(win.localStorage.getItem('isLoggedIn')).to.eq('true')
      expect(win.localStorage.getItem('user')).to.not.be.null
    })
  })

})