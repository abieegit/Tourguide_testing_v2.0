"""
Test File: User Registration
Mirrors Cypress register.cy.js
TC-R1 to TC-R5
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import string

BASE_URL = "http://localhost:5173"


def go_to_register(driver):
    """Helper: Navigate to login page and switch to register mode"""
    driver.get(f"{BASE_URL}/userlogin")
    wait = WebDriverWait(driver, 10)
    # Click "create a new account" toggle button
    toggle = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'create a new account')]")
    ))
    toggle.click()
    time.sleep(0.5)


def random_email():
    """Generate unique email to avoid duplicate errors"""
    suffix = ''.join(random.choices(string.ascii_lowercase, k=6))
    return f"testuser_{suffix}@tripbuddy.com"


def test_valid_registration_succeeds(driver):
    """TC-R1: Valid registration with unique email succeeds"""
    go_to_register(driver)
    wait = WebDriverWait(driver, 10)

    driver.find_element(By.NAME, "name").send_keys("Test User")
    driver.find_element(By.NAME, "email").send_keys(random_email())
    driver.find_element(By.NAME, "password").send_keys("123456")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    # Handle success alert
    try:
        wait.until(EC.alert_is_present())
        driver.switch_to.alert.accept()
    except Exception:
        pass

    # Should redirect to /deals after registration
    wait.until(EC.url_contains("/deals"))
    assert "/deals" in driver.current_url


def test_empty_name_shows_validation_error(driver):
    """TC-R2: Empty name field shows validation error"""
    go_to_register(driver)

    # Leave name empty, fill rest
    driver.find_element(By.NAME, "email").send_keys("someuser@tripbuddy.com")
    driver.find_element(By.NAME, "password").send_keys("123456")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(1)
    error = driver.find_element(By.CSS_SELECTOR, ".text-red-700")
    assert error.is_displayed()
    assert "name" in error.text.lower()


def test_invalid_email_format_shows_error(driver):
    """TC-R3: Invalid email format triggers validation error"""
    go_to_register(driver)

    driver.find_element(By.NAME, "name").send_keys("Test User")
    driver.find_element(By.NAME, "email").send_keys("notanemail")
    driver.find_element(By.NAME, "password").send_keys("123456")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(1)
    error = driver.find_element(By.CSS_SELECTOR, ".text-red-700")
    assert error.is_displayed()
    assert "email" in error.text.lower()


def test_short_password_shows_validation_error(driver):
    """TC-R4: Password shorter than 6 characters shows error"""
    go_to_register(driver)

    driver.find_element(By.NAME, "name").send_keys("Test User")
    driver.find_element(By.NAME, "email").send_keys(random_email())
    driver.find_element(By.NAME, "password").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(1)
    error = driver.find_element(By.CSS_SELECTOR, ".text-red-700")
    assert error.is_displayed()
    assert "password" in error.text.lower()


def test_duplicate_email_shows_server_error(driver):
    """TC-R5: Already registered email shows server-side error"""
    go_to_register(driver)

    # Use a known existing email
    driver.find_element(By.NAME, "name").send_keys("Test User")
    driver.find_element(By.NAME, "email").send_keys("testuser@tripbuddy.com")
    driver.find_element(By.NAME, "password").send_keys("123123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(2)
    error = driver.find_element(By.CSS_SELECTOR, ".text-red-700")
    assert error.is_displayed()