describe('TC-G: Gallery Submission', () => {

  beforeEach(() => {
    cy.visit('/userlogin')
    cy.setUserSession()
    cy.visit('/submit-gallery')
    cy.get('.test-submit-gallery-submit-button', { timeout: 10000 }).should('be.visible')
  })

  it('TC-G1: Valid submission redirects to my-gallery', () => {
    cy.get('.test-submit-gallery-name-input').type('Hunza Valley')
    cy.get('.test-submit-gallery-link-input').type('https://maps.google.com/hunza')
    cy.get('.test-submit-gallery-image-input').type('https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg')
    cy.get('.test-submit-gallery-description-textarea').type('Beautiful valley in northern Pakistan.')

    cy.on('window:alert', (text) => { expect(text).to.exist })

    cy.get('.test-submit-gallery-submit-button').click()
    cy.url().should('include', '/my-gallery')
  })

  it('TC-G2: Empty place name shows inline validation error', () => {
    cy.get('.test-submit-gallery-link-input').type('https://maps.google.com/hunza')
    cy.get('.test-submit-gallery-image-input').type('https://example.com/photo.jpg')
    cy.get('.test-submit-gallery-submit-button').click()

    cy.get('.test-submit-gallery-name-error')
      .should('be.visible')
      .and('contain.text', 'at least 2 characters')
  })

  it('TC-G3: Invalid place link shows inline validation error', () => {
    cy.get('.test-submit-gallery-name-input').type('Hunza Valley')
    cy.get('.test-submit-gallery-link-input').type('not-a-valid-url')
    cy.get('.test-submit-gallery-image-input').type('https://example.com/photo.jpg')
    cy.get('.test-submit-gallery-submit-button').click()

    cy.get('.test-submit-gallery-link-error')
      .should('be.visible')
      .and('contain.text', 'valid URL')
  })

  it('TC-G4: Invalid image URL shows inline validation error', () => {
    cy.get('.test-submit-gallery-name-input').type('Hunza Valley')
    cy.get('.test-submit-gallery-link-input').type('https://maps.google.com/hunza')
    cy.get('.test-submit-gallery-image-input').type('https://example.com/notanimage')
    cy.get('.test-submit-gallery-submit-button').click()

    cy.get('.test-submit-gallery-image-error')
      .should('be.visible')
      .and('contain.text', '.jpg, .jpeg, .png, or .webp')
  })

  it('TC-G5: Description over 500 characters shows inline validation error', () => {
    cy.get('.test-submit-gallery-name-input').type('Hunza Valley')
    cy.get('.test-submit-gallery-link-input').type('https://maps.google.com/hunza')
    cy.get('.test-submit-gallery-image-input').type('https://example.com/photo.jpg')
    cy.get('.test-submit-gallery-description-textarea').type('A'.repeat(501))
    cy.get('.test-submit-gallery-submit-button').click()

    cy.get('.test-submit-gallery-description-error')
      .should('be.visible')
      .and('contain.text', '500 characters')
  })

  it('TC-G6: Not logged in redirects to login on submit', () => {
    cy.clearLocalStorage()
    cy.visit('/submit-gallery')
    cy.get('.test-submit-gallery-submit-button', { timeout: 10000 }).should('be.visible')

    cy.get('.test-submit-gallery-name-input').type('Hunza Valley')
    cy.get('.test-submit-gallery-link-input').type('https://maps.google.com/hunza')
    cy.get('.test-submit-gallery-image-input').type('https://example.com/photo.jpg')

    cy.on('window:alert', (text) => {
      expect(text).to.include('logged in')
    })

    cy.get('.test-submit-gallery-submit-button').click()
    cy.url().should('include', '/userlogin')
  })

  it('TC-G7: Back to Gallery button navigates to gallery page', () => {
    cy.get('.test-submit-gallery-cancel-button').click()
    cy.url().should('include', '/gallery')
  })

})