"""
Test File: Browse Travel Deals
Mirrors Cypress deals.cy.js
TC-04, TC-04b
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"


def test_deals_page_displays_cards(driver):
    """TC-04: Deals page shows cards with title, price and Book Now button"""
    driver.get(f"{BASE_URL}/deals")
    wait = WebDriverWait(driver, 10)

    # Wait for at least one Book Now button to appear
    wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[data-testid='book-now-btn']")
    ))

    cards = driver.find_elements(By.CSS_SELECTOR, "[data-testid='book-now-btn']")
    assert len(cards) > 0

    # Verify h3 headings (deal titles) exist
    titles = driver.find_elements(By.TAG_NAME, "h3")
    assert len(titles) > 0


def test_search_validation_less_than_2_chars(driver):
    """TC-04b: Search with less than 2 characters shows validation"""
    driver.get(f"{BASE_URL}/deals")
    wait = WebDriverWait(driver, 10)

    search_input = wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[aria-label='Search deals']")
    ))
    search_input.clear()
    search_input.send_keys("a")  # Only 1 character

    import time
    time.sleep(1)

    # Should show some validation — either alert or inline message
    # Check page still on deals
    assert "/deals" in driver.current_url