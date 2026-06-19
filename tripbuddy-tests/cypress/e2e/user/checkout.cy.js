describe('Phase 4: Payment / Checkout Module', () => {

  // Helper — finds an approved booking and goes to its checkout page
  const goToCheckout = () => {
    cy.visit('/userlogin')
    cy.setUserSession()
    cy.visit('/my-bookings')
    cy.contains('h2', 'My Bookings', { timeout: 10000 }).should('be.visible')
  }

  it('TC-P1: Checkout page loads for approved booking', () => {
    goToCheckout()
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Checkout")').length > 0) {
        cy.contains('button', 'Checkout').first().click()
        cy.get('.test-checkout-heading', { timeout: 8000 })
          .should('contain.text', 'Secure Checkout')
      } else {
        cy.log('No approved unpaid bookings available — approve one from admin first')
      }
    })
  })

  it('TC-P2: Empty card name shows validation alert', () => {
    goToCheckout()
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Checkout")').length > 0) {
        cy.contains('button', 'Checkout').first().click()
        cy.get('.test-checkout-heading', { timeout: 8000 }).should('be.visible')

        // Leave card name empty, fill rest
        cy.get('.test-card-number-input').type('1234567890123456')
        cy.get('.test-expiry-input').type('12/26')
        cy.get('.test-cvv-input').type('123')

        cy.on('window:alert', (text) => {
          expect(text).to.include('card holder name')
        })
        cy.get('.test-submit-payment-button').click()
      } else {
        cy.log('No approved booking to test checkout')
      }
    })
  })

  it('TC-P3: Short card number shows validation alert', () => {
    goToCheckout()
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Checkout")').length > 0) {
        cy.contains('button', 'Checkout').first().click()
        cy.get('.test-checkout-heading', { timeout: 8000 }).should('be.visible')

        cy.get('.test-card-name-input').type('John Doe')
        cy.get('.test-card-number-input').type('1234') // Too short
        cy.get('.test-expiry-input').type('12/26')
        cy.get('.test-cvv-input').type('123')

        cy.on('window:alert', (text) => {
          expect(text).to.include('16 digits')
        })
        cy.get('.test-submit-payment-button').click()
      } else {
        cy.log('No approved booking to test checkout')
      }
    })
  })

  it('TC-P4: Invalid expiry format shows validation alert', () => {
    goToCheckout()
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Checkout")').length > 0) {
        cy.contains('button', 'Checkout').first().click()
        cy.get('.test-checkout-heading', { timeout: 8000 }).should('be.visible')

        cy.get('.test-card-name-input').type('John Doe')
        cy.get('.test-card-number-input').type('1234567890123456')
        cy.get('.test-expiry-input').type('1226') // Wrong format
        cy.get('.test-cvv-input').type('123')

        cy.on('window:alert', (text) => {
          expect(text).to.include('MM/YY')
        })
        cy.get('.test-submit-payment-button').click()
      } else {
        cy.log('No approved booking to test checkout')
      }
    })
  })

  it('TC-P5: Invalid CVV shows validation alert', () => {
    goToCheckout()
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Checkout")').length > 0) {
        cy.contains('button', 'Checkout').first().click()
        cy.get('.test-checkout-heading', { timeout: 8000 }).should('be.visible')

        cy.get('.test-card-name-input').type('John Doe')
        cy.get('.test-card-number-input').type('1234567890123456')
        cy.get('.test-expiry-input').type('12/26')
        cy.get('.test-cvv-input').type('12') // Too short

        cy.on('window:alert', (text) => {
          expect(text).to.include('3 or 4 digits')
        })
        cy.get('.test-submit-payment-button').click()
      } else {
        cy.log('No approved booking to test checkout')
      }
    })
  })

  it('TC-P6: Successful payment redirects to my-bookings', () => {
    goToCheckout()
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Checkout")').length > 0) {
        cy.contains('button', 'Checkout').first().click()
        cy.get('.test-checkout-heading', { timeout: 8000 }).should('be.visible')

        cy.get('.test-card-name-input').type('John Doe')
        cy.get('.test-card-number-input').type('1234567890123456')
        cy.get('.test-expiry-input').type('12/26')
        cy.get('.test-cvv-input').type('123')

        cy.on('window:alert', (text) => { expect(text).to.exist })
        cy.get('.test-submit-payment-button').click()
        cy.url().should('include', '/my-bookings')
      } else {
        cy.log('No approved booking available for payment test')
      }
    })
  })

})  