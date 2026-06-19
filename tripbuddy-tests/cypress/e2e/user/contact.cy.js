describe('TC-08: Contact Us Form', () => {

  beforeEach(() => {
    cy.visit('/userlogin')
    cy.setUserSession()
    cy.visit('/contactus')
    cy.get('.test-contact-name-input', { timeout: 10000 }).should('be.visible')
  })

  it('TC-08: Should submit contact form successfully', () => {
    cy.get('.test-contact-name-input').type('Test User')
    cy.get('.test-contact-email-input').type('testuser@tripbuddy.com')
    cy.get('.test-contact-subject-input').type('Cypress Automation Test')
    cy.get('.test-contact-message-input').type('This is a test message sent by Cypress.')
    cy.get('[data-testid="contact-submit-btn"]').click()
    cy.get('[data-testid="success-message"]', { timeout: 8000 }).should('be.visible')
      .and('contain.text', 'Query Sent')
  })

  it('TC-08b: Empty name and message shows alert', () => {
    // Leave name and message empty, only fill email
    cy.get('.test-contact-email-input').type('testuser@tripbuddy.com')
    cy.get('.test-contact-subject-input').type('Test Subject')

    cy.on('window:alert', (text) => {
      expect(text).to.include('Please fill in all required fields')
    })

    cy.get('[data-testid="contact-submit-btn"]').click()
  })

  it('TC-08c: Invalid email format shows alert', () => {
    cy.get('.test-contact-name-input').type('Test User')
    cy.get('.test-contact-email-input').type('notanemail')
    cy.get('.test-contact-subject-input').type('Test Subject')
    cy.get('.test-contact-message-input').type('Test message')

    cy.on('window:alert', (text) => {
      expect(text).to.include('valid email')
    })

    cy.get('[data-testid="contact-submit-btn"]').click()
  })

  it('TC-08d: Should redirect to login if not logged in', () => {
    cy.clearLocalStorage()
    cy.visit('/contactus')
    cy.get('.test-contact-name-input').type('Test User')
    cy.get('.test-contact-email-input').type('testuser@tripbuddy.com')
    cy.get('.test-contact-subject-input').type('Test')
    cy.get('.test-contact-message-input').type('Test message')
    cy.on('window:alert', (text) => {
      expect(text).to.include('Please login')
    })
    cy.get('[data-testid="contact-submit-btn"]').click()
    cy.url().should('include', '/userlogin')
  })

})