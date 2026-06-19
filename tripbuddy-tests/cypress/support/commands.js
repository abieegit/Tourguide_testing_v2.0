// Reusable login command for user
Cypress.Commands.add('loginUser', (email, password) => {
  cy.visit('/userlogin')
  cy.get('input[name="email"]').clear().type(email)
  cy.get('input[name="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
  // Dismiss the success alert that appears after login
  cy.on('window:alert', () => true)
})

// Reusable login command for admin
Cypress.Commands.add('loginAdmin', () => {
  cy.visit('/admin')
  cy.get('input#username').clear().type('admin')
  cy.get('input#password').clear().type('123')
  cy.get('button[type="submit"]').click()
})

// Set localStorage directly to skip login UI (faster for tests that need auth as precondition)
Cypress.Commands.add('setUserSession', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('isLoggedIn', 'true')
    win.localStorage.setItem('user', JSON.stringify({ id: '6a2b987e8e3a415e09147769', name: 'Test User', email: 'testuser@tripbuddy.com' }))
  })
})

Cypress.Commands.add('setAdminSession', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('tb_is_admin', 'true')
    win.localStorage.setItem('admin_username', 'admin')
  })
})