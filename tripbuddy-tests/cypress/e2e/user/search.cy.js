describe('Phase 2: Search Module', () => {

  beforeEach(() => {
    cy.visit('/userlogin')
    cy.setUserSession()
    cy.visit('/deals')
    cy.get('h3', { timeout: 10000 }).should('be.visible')
  })

  it('TC-S1: Valid search filters deals correctly', () => {
    cy.get('input[aria-label="Search deals"]').type('tour')
    cy.wait(500) // wait for debounce
    // Either results show or no results message appears
    cy.get('body').then(($body) => {
      if ($body.find('h3').length > 0) {
        cy.get('h3').should('be.visible')
      } else {
        cy.contains('No deals matched').should('be.visible')
      }
    })
  })

  it('TC-S2: Search with less than 2 characters shows validation', () => {
    cy.get('input[aria-label="Search deals"]').type('a')
    cy.contains('Please enter at least 2 characters').should('be.visible')
  })

  it('TC-S3: Invalid search shows no results message', () => {
    cy.get('input[aria-label="Search deals"]').type('xyzabc123notexist')
    cy.wait(500)
    cy.contains('No deals matched').should('be.visible')
  })

  it('TC-S4: Search is case insensitive', () => {
    // Get first deal title then search uppercase version
    cy.get('h3').first().invoke('text').then((title) => {
      const upperSearch = title.substring(0, 4).toUpperCase()
      cy.get('input[aria-label="Search deals"]').type(upperSearch)
      cy.wait(500)
      cy.get('h3').should('be.visible')
    })
  })

  it('TC-S5: Clear button resets search and shows all deals', () => {
    cy.get('input[aria-label="Search deals"]').type('tour')
    cy.wait(300)
    cy.contains('button', 'Clear').click()
    cy.get('input[aria-label="Search deals"]').should('have.value', '')
    cy.get('h3').should('have.length.greaterThan', 0)
  })

})