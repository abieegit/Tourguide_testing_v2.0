"""
Test File: Payment / Checkout Module
Mirrors Cypress checkout.cy.js
TC-P1 to TC-P6
NOTE: Requires an approved booking in DB for testuser@tripbuddy.com
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"


def login_and_go_to_checkout(driver):
    """Helper: Login and navigate to checkout via my-bookings"""
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
    driver.get(f"{BASE_URL}/my-bookings")
    time.sleep(2)

    # Click Checkout button on first approved booking
    checkout_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Checkout')]")
    ))
    checkout_btn.click()
    time.sleep(2)


def test_checkout_page_loads(driver):
    """TC-P1: Checkout page loads with payment heading"""
    login_and_go_to_checkout(driver)
    wait = WebDriverWait(driver, 10)

    heading = wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-checkout-heading")
    ))
    assert heading.is_displayed()


def test_empty_card_name_shows_alert(driver):
    """TC-P2: Submitting without card name shows validation alert"""
    login_and_go_to_checkout(driver)
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-card-number-input")
    ))

    # Fill everything except card name
    driver.find_element(By.CSS_SELECTOR, ".test-card-number-input").send_keys("1234567890123456")
    driver.find_element(By.CSS_SELECTOR, ".test-expiry-input").send_keys("12/26")
    driver.find_element(By.CSS_SELECTOR, ".test-cvv-input").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, ".test-submit-payment-button").click()

    alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
    assert alert is not None
    alert.accept()


def test_short_card_number_shows_alert(driver):
    """TC-P3: Card number shorter than 16 digits shows alert"""
    login_and_go_to_checkout(driver)
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-card-name-input")
    ))

    driver.find_element(By.CSS_SELECTOR, ".test-card-name-input").send_keys("John Doe")
    driver.find_element(By.CSS_SELECTOR, ".test-card-number-input").send_keys("1234")
    driver.find_element(By.CSS_SELECTOR, ".test-expiry-input").send_keys("12/26")
    driver.find_element(By.CSS_SELECTOR, ".test-cvv-input").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, ".test-submit-payment-button").click()

    alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
    assert alert is not None
    alert.accept()


def test_invalid_expiry_format_shows_alert(driver):
    """TC-P4: Invalid expiry format shows alert"""
    login_and_go_to_checkout(driver)
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-card-name-input")
    ))

    driver.find_element(By.CSS_SELECTOR, ".test-card-name-input").send_keys("John Doe")
    driver.find_element(By.CSS_SELECTOR, ".test-card-number-input").send_keys("1234567890123456")
    driver.find_element(By.CSS_SELECTOR, ".test-expiry-input").send_keys("13/99")  # Invalid month
    driver.find_element(By.CSS_SELECTOR, ".test-cvv-input").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, ".test-submit-payment-button").click()

    alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
    assert alert is not None
    alert.accept()


def test_invalid_cvv_shows_alert(driver):
    """TC-P5: CVV less than 3 digits shows alert"""
    login_and_go_to_checkout(driver)
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-card-name-input")
    ))

    driver.find_element(By.CSS_SELECTOR, ".test-card-name-input").send_keys("John Doe")
    driver.find_element(By.CSS_SELECTOR, ".test-card-number-input").send_keys("1234567890123456")
    driver.find_element(By.CSS_SELECTOR, ".test-expiry-input").send_keys("12/26")
    driver.find_element(By.CSS_SELECTOR, ".test-cvv-input").send_keys("12")  # Too short
    driver.find_element(By.CSS_SELECTOR, ".test-submit-payment-button").click()

    alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
    assert alert is not None
    alert.accept()


def test_successful_payment_redirects(driver):
    """TC-P6: Valid payment details redirect to my-bookings"""
    login_and_go_to_checkout(driver)
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-card-name-input")
    ))

    driver.find_element(By.CSS_SELECTOR, ".test-card-name-input").send_keys("John Doe")
    driver.find_element(By.CSS_SELECTOR, ".test-card-number-input").send_keys("1234567890123456")
    driver.find_element(By.CSS_SELECTOR, ".test-expiry-input").send_keys("12/26")
    driver.find_element(By.CSS_SELECTOR, ".test-cvv-input").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, ".test-submit-payment-button").click()

    try:
        alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    wait.until(EC.url_contains("/my-bookings"))
    assert "/my-bookings" in driver.current_url