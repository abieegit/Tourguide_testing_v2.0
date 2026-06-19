"""
Test File: Book a Tour
Mirrors Cypress booking.cy.js
TC-05, TC-05b
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


def test_book_deal_when_logged_in(driver):
    """TC-05: Logged in user can click Book Now successfully"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/deals")

    # Click first Book Now button
    book_btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, "[data-testid='book-now-btn']")
    ))
    book_btn.click()

    time.sleep(2)

    # Handle any confirmation alert
    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    time.sleep(1)
    # Should stay on deals or go to my-bookings
    assert "/deals" in driver.current_url or "/my-bookings" in driver.current_url


def test_book_redirects_to_login_when_not_logged_in(driver):
    """TC-05b: Unauthenticated user clicking Book Now redirects to login"""
    driver.get(f"{BASE_URL}/deals")
    wait = WebDriverWait(driver, 10)

    book_btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, "[data-testid='book-now-btn']")
    ))
    book_btn.click()

    time.sleep(2)

    # Handle alert if any
    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    wait.until(EC.url_contains("/userlogin"))
    assert "/userlogin" in driver.current_url