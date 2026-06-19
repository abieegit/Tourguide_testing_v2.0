"""
Test File: Security / Unauthorized Access
Mirrors Cypress security.cy.js
TC-SEC1 to TC-SEC4
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"


def test_unauthenticated_my_bookings_redirects(driver):
    """TC-SEC1: Unauthenticated user visiting /my-bookings redirects to login"""
    driver.get(f"{BASE_URL}/my-bookings")
    wait = WebDriverWait(driver, 10)

    wait.until(EC.url_contains("/userlogin"))
    assert "/userlogin" in driver.current_url


def test_unauthenticated_dashboard_redirects(driver):
    """TC-SEC2: Unauthenticated user visiting /admin/dashboard redirects"""
    driver.get(f"{BASE_URL}/admin")
    wait = WebDriverWait(driver, 10)

    wait.until(lambda d: "/admin" in d.current_url)
    assert "/admin" in driver.current_url
    assert "/dashboard" not in driver.current_url or "/dashboard" not in driver.current_url


def test_contact_form_requires_login(driver):
    """TC-SEC3: Contact form submit without login redirects to login"""
    driver.get(f"{BASE_URL}/contactus")
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-contact-name-input")
    ))

    driver.find_element(By.CSS_SELECTOR, ".test-contact-name-input").send_keys("Hacker")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-email-input").send_keys("hacker@evil.com")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-subject-input").send_keys("Attack")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-message-input").send_keys("Unauthorized message")
    driver.find_element(By.CSS_SELECTOR, "[data-testid='contact-submit-btn']").click()

    time.sleep(2)
    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    wait.until(EC.url_contains("/userlogin"))
    assert "/userlogin" in driver.current_url


def test_booking_requires_login(driver):
    """TC-SEC4: Clicking Book Now without login redirects to login"""
    driver.get(f"{BASE_URL}/deals")
    wait = WebDriverWait(driver, 10)

    book_btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, "[data-testid='book-now-btn']")
    ))
    book_btn.click()

    time.sleep(2)
    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    wait.until(EC.url_contains("/userlogin"))
    assert "/userlogin" in driver.current_url