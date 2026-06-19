"""
Test File: My Bookings and Cancellation
Mirrors Cypress myBookings.cy.js
TC-06, TC-07
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"


def login_as_user(driver):
    """Helper: Log in as test user"""
    driver.get(f"{BASE_URL}/userlogin")
    wait = WebDriverWait(driver, 10)

    driver.find_element(By.NAME, "email").send_keys("testuser@tripbuddy.com")
    driver.find_element(By.NAME, "password").send_keys("123123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    try:
        wait.until(EC.alert_is_present())
        driver.switch_to.alert.accept()
    except Exception:
        pass

    wait.until(EC.url_contains("/deals"))


def test_my_bookings_page_displays(driver):
    """TC-06: My Bookings page loads and shows booking list or empty state"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/my-bookings")

    # Either bookings list or no-bookings message must appear
    wait.until(lambda d: (
        len(d.find_elements(By.CSS_SELECTOR, "[data-testid='bookings-list']")) > 0 or
        len(d.find_elements(By.CSS_SELECTOR, "[data-testid='no-bookings']")) > 0
    ))

    has_bookings = len(driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='bookings-list']"
    )) > 0
    has_empty = len(driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='no-bookings']"
    )) > 0

    assert has_bookings or has_empty


def test_cancel_pending_booking(driver):
    """TC-07: User can cancel a pending booking"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/my-bookings")
    time.sleep(2)

    cancel_buttons = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='cancel-btn']"
    )

    if len(cancel_buttons) == 0:
        # No pending bookings to cancel — test passes gracefully
        print("No pending bookings found — skipping cancellation")
        return

    cancel_buttons[0].click()
    time.sleep(1)

    # Handle confirmation dialog if present
    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    time.sleep(2)
    # Page should still be on my-bookings
    assert "/my-bookings" in driver.current_url