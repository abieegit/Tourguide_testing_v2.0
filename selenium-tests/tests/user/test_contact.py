"""
Test File: Contact Us Form
Mirrors Cypress contact.cy.js
TC-08 to TC-08d
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


def test_contact_form_submits_successfully(driver):
    """TC-08: Valid contact form submission shows success"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/contactus")

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-contact-name-input")
    ))

    driver.find_element(By.CSS_SELECTOR, ".test-contact-name-input").send_keys("Test User")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-email-input").send_keys("testuser@tripbuddy.com")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-subject-input").send_keys("Test Subject")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-message-input").send_keys("This is a test message from Selenium.")
    driver.find_element(By.CSS_SELECTOR, "[data-testid='contact-submit-btn']").click()

    time.sleep(2)

    # Check for success message
    success = wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[data-testid='success-message']")
    ))
    assert success.is_displayed()


def test_empty_name_and_message_shows_alert(driver):
    """TC-08b: Empty name and message triggers validation alert"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/contactus")
    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[data-testid='contact-submit-btn']")
    ))

    # Submit with everything empty
    driver.find_element(By.CSS_SELECTOR, "[data-testid='contact-submit-btn']").click()

    try:
        alert = WebDriverWait(driver, 4).until(EC.alert_is_present())
        assert alert is not None
        alert.accept()
    except Exception:
        # Inline error fallback
        time.sleep(1)
        body = driver.find_element(By.TAG_NAME, "body").text
        assert "required" in body.lower() or "empty" in body.lower()


def test_invalid_email_format_shows_alert(driver):
    """TC-08c: Invalid email format in contact form triggers alert"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/contactus")
    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-contact-name-input")
    ))

    driver.find_element(By.CSS_SELECTOR, ".test-contact-name-input").send_keys("Test User")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-email-input").send_keys("bademail")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-subject-input").send_keys("Subject")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-message-input").send_keys("Message here")
    driver.find_element(By.CSS_SELECTOR, "[data-testid='contact-submit-btn']").click()

    try:
        alert = WebDriverWait(driver, 4).until(EC.alert_is_present())
        assert alert is not None
        alert.accept()
    except Exception:
        time.sleep(1)
        body = driver.find_element(By.TAG_NAME, "body").text
        assert "email" in body.lower()


def test_contact_redirects_to_login_if_not_logged_in(driver):
    """TC-08d: Unauthenticated user submitting contact form redirects to login"""
    driver.get(f"{BASE_URL}/contactus")
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-contact-name-input")
    ))

    driver.find_element(By.CSS_SELECTOR, ".test-contact-name-input").send_keys("Test User")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-email-input").send_keys("testuser@tripbuddy.com")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-subject-input").send_keys("Subject")
    driver.find_element(By.CSS_SELECTOR, ".test-contact-message-input").send_keys("Message")
    driver.find_element(By.CSS_SELECTOR, "[data-testid='contact-submit-btn']").click()

    time.sleep(2)

    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    wait.until(EC.url_contains("/userlogin"))
    assert "/userlogin" in driver.current_url