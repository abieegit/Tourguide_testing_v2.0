describe('Phase 1: Registration Module', () => {

  beforeEach(() => {
    cy.visit('/userlogin')
    cy.contains('button', 'create a new account').click()
    cy.get('input[name="name"]').should('be.visible')
  })

  it('TC-R1: Valid registration succeeds', () => {
    const uniqueEmail = `testuser_${Date.now()}@tripbuddy.com`
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type(uniqueEmail)
    cy.get('input[name="password"]').type('123123')
    cy.on('window:alert', (text) => { expect(text).to.exist })
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/deals')
  })

  it('TC-R2: Empty name field shows validation error', () => {
    cy.get('input[name="email"]').type('test@tripbuddy.com')
    cy.get('input[name="password"]').type('123123')
    cy.get('button[type="submit"]').click()
    cy.get('.text-red-700').should('be.visible')
      .and('contain.text', 'Full name is required')
  })

  it('TC-R3: Invalid email format shows validation error', () => {
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('notanemail')
    cy.get('input[name="password"]').type('123123')
    cy.get('button[type="submit"]').click()
    cy.get('.text-red-700').should('be.visible')
      .and('contain.text', 'valid email')
  })

  it('TC-R4: Short password shows validation error', () => {
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@tripbuddy.com')
    cy.get('input[name="password"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.get('.text-red-700').should('be.visible')
      .and('contain.text', 'at least 6 characters')
  })

  it('TC-R5: Duplicate email shows error from server', () => {
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('testuser@tripbuddy.com')
    cy.get('input[name="password"]').type('123123')
    cy.get('button[type="submit"]').click()
    cy.get('.text-red-700', { timeout: 8000 }).should('be.visible')
  })

})