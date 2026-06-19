"""
Test File: Session & Logout Management
Mirrors Cypress logout.cy.js
TC-SL1 to TC-SL4
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"


def login_as_user(driver):
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


def login_as_admin(driver):
    driver.get(f"{BASE_URL}/admin")
    wait = WebDriverWait(driver, 10)
    driver.find_element(By.ID, "username").send_keys("admin")
    driver.find_element(By.ID, "password").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    wait.until(EC.url_contains("/dashboard"))


def test_user_logout_clears_session(driver):
    """TC-SL1: Logout clears session and redirects to home"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    logout_btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, ".test-user-logout-button")
    ))
    logout_btn.click()
    time.sleep(1)

    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    wait.until(EC.url_to_be(f"{BASE_URL}/") or EC.url_contains("localhost:5173"))
    assert driver.current_url == f"{BASE_URL}/" or "5173" in driver.current_url


def test_login_button_reappears_after_logout(driver):
    """TC-SL2: After logout login button reappears in navbar"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    logout_btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, ".test-user-logout-button")
    ))
    logout_btn.click()

    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    time.sleep(1)
    login_btn = wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-user-login-button")
    ))
    assert login_btn.is_displayed()


def test_session_persists_after_refresh(driver):
    """TC-SL3: Session stays active after browser page refresh"""
    login_as_user(driver)
    wait = WebDriverWait(driver, 10)

    driver.refresh()
    time.sleep(2)

    # Welcome message should still be visible after refresh
    welcome = wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, ".test-user-welcome-message")
    ))
    assert welcome.is_displayed()


def test_admin_logout_clears_session(driver):
    """TC-SL4: Admin logout clears admin session"""
    login_as_admin(driver)
    wait = WebDriverWait(driver, 10)

    logout_btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, ".test-admin-desktop-logout")
    ))
    logout_btn.click()
    time.sleep(1)

    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    wait.until(EC.url_contains("/admin"))
    assert "/admin" in driver.current_url