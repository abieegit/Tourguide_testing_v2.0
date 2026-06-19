"""
Test File: Login functionality
Mirrors Cypress login.cy.js test cases
"""

import time
from selenium.webdriver.common.by import By


BASE_URL = "http://localhost:5173"


def test_login_screen_loads(driver):
    """TC-L1: Login page loads with email and password fields"""
    driver.get(f"{BASE_URL}/userlogin")

    email_field = driver.find_element(By.NAME, "email")
    password_field = driver.find_element(By.NAME, "password")

    assert email_field.is_displayed()
    assert password_field.is_displayed()


def test_valid_login_redirects_to_deals(driver):
    """TC-L2: Valid login redirects to /deals page"""
    driver.get(f"{BASE_URL}/userlogin")

    driver.find_element(By.NAME, "email").send_keys("testuser@tripbuddy.com")
    driver.find_element(By.NAME, "password").send_keys("123123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(1)
    try:
        driver.switch_to.alert.accept()
    except:
        pass

    time.sleep(2)
    assert "/deals" in driver.current_url


def test_invalid_login_shows_error(driver):
    """TC-L3: Wrong password shows error message"""
    driver.get(f"{BASE_URL}/userlogin")

    driver.find_element(By.NAME, "email").send_keys("testuser@tripbuddy.com")
    driver.find_element(By.NAME, "password").send_keys("WrongPassword999")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(2)
    error_element = driver.find_element(By.CSS_SELECTOR, ".text-red-700")
    assert error_element.is_displayed()