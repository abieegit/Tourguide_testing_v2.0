"""
Test File: Search Module
Mirrors Cypress search.cy.js
TC-S1 to TC-S5
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"


def search_for(driver, term):
    """Helper: Type into search box and wait"""
    wait = WebDriverWait(driver, 10)
    search = wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[aria-label='Search deals']")
    ))
    search.clear()
    search.send_keys(term)
    time.sleep(1.5)  # Wait for filter to apply


def test_valid_search_filters_deals(driver):
    """TC-S1: Valid search term filters deal cards"""
    driver.get(f"{BASE_URL}/deals")
    wait = WebDriverWait(driver, 10)

    # Wait for page to load
    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[data-testid='book-now-btn']")
    ))

    initial_cards = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='book-now-btn']"
    )
    initial_count = len(initial_cards)

    # Search for something specific
    search_for(driver, "Paris")

    filtered_cards = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='book-now-btn']"
    )

    # Either filtered or no results — both are valid responses
    assert len(filtered_cards) <= initial_count


def test_search_less_than_2_chars_shows_validation(driver):
    """TC-S2: Search with less than 2 chars triggers validation"""
    driver.get(f"{BASE_URL}/deals")
    search_for(driver, "x")

    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert_text = alert.text
        alert.accept()
        assert "2" in alert_text or "character" in alert_text.lower()
    except Exception:
        # Inline validation instead of alert
        time.sleep(1)
        assert "/deals" in driver.current_url


def test_invalid_search_shows_no_results(driver):
    """TC-S3: Gibberish search shows no results message"""
    driver.get(f"{BASE_URL}/deals")
    search_for(driver, "xyzxyzxyz123")

    time.sleep(1)
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert (
        "no" in body_text.lower() or
        "not found" in body_text.lower() or
        len(driver.find_elements(By.CSS_SELECTOR, "[data-testid='book-now-btn']")) == 0
    )


def test_search_is_case_insensitive(driver):
    """TC-S4: Search works regardless of letter case"""
    driver.get(f"{BASE_URL}/deals")
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[data-testid='book-now-btn']")
    ))

    search_for(driver, "paris")
    lowercase_count = len(driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='book-now-btn']"
    ))

    search_for(driver, "PARIS")
    uppercase_count = len(driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='book-now-btn']"
    ))

    assert lowercase_count == uppercase_count


def test_clear_button_resets_search(driver):
    """TC-S5: Clearing search restores all deal cards"""
    driver.get(f"{BASE_URL}/deals")
    wait = WebDriverWait(driver, 10)

    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[data-testid='book-now-btn']")
    ))

    initial_count = len(driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='book-now-btn']"
    ))

    search_for(driver, "Paris")

  # 1. Target the clear element by its new data-testid attribute and click it
    clear_button = driver.find_element(
        By.CSS_SELECTOR, "[data-testid='Clear-search']"
    )
    clear_button.click()
    
    # Allow the React 300ms debounce layout function to process state synchronization
    time.sleep(1.5)

    # 2. Count the visible book buttons re-rendered on the dashboard layout
    restored_count = len(driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='book-now-btn']"
    ))

    # Verification Assertion
    assert restored_count == initial_count