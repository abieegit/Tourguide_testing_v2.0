"""
Test File: Home Page Verification
Mirrors Cypress home.cy.js
TC-H1 to TC-H4
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"


def test_home_page_loads_successfully(driver):
    """TC-H1: Home page loads with hero container and heading"""
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 10)

    hero = wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-home-hero-container")
    ))
    heading = driver.find_element(By.CSS_SELECTOR, ".test-home-hero-heading")

    assert hero.is_displayed()
    assert heading.is_displayed()
    assert heading.text != ""


def test_explore_deals_button_navigates_to_deals(driver):
    """TC-H2: Clicking Explore Deals navigates to /deals"""
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 10)

    btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, ".test-home-explore-deals-button")
    ))
    btn.click()

    wait.until(EC.url_contains("/deals"))
    assert "/deals" in driver.current_url


def test_admin_navbar_link_navigates_to_admin_login(driver):
    """TC-H3: Admin button in navbar goes to admin login"""
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 10)

    admin_link = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, ".test-nav-admin-dashboard-link")
    ))
    admin_link.click()

    wait.until(EC.url_contains("/admin"))
    assert "/admin" in driver.current_url


def test_login_button_in_navbar_navigates_to_login(driver):
    """TC-H4: Login button in navbar goes to /userlogin"""
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 10)

    login_btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, ".test-user-login-button")
    ))
    login_btn.click()

    wait.until(EC.url_contains("/userlogin"))
    assert "/userlogin" in driver.current_url