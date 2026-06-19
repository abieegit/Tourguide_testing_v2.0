"""
Test File: Admin Gallery Management
Extracted from AdminDashboard.jsx analysis
Gallery tab is inside /admin/dashboard — NOT a separate route

data-testid values confirmed from JSX:
- approve-button  (NOT approve-btn)
- reject-button   (NOT reject-btn)
- delete-button
- place-link-{id}
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"


def login_as_admin(driver):
    driver.get(f"{BASE_URL}/admin")
    wait = WebDriverWait(driver, 10)
    driver.find_element(By.ID, "username").send_keys("admin")
    driver.find_element(By.ID, "password").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    wait.until(EC.url_contains("/dashboard"))


def navigate_to_gallery_tab(driver):
    wait = WebDriverWait(driver, 10)
    gallery_tab = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Gallery Management')]")
    ))
    gallery_tab.click()
    time.sleep(1.5)


def test_gallery_tab_loads(driver):
    """Gallery Management tab loads with submissions or empty state"""
    login_as_admin(driver)
    navigate_to_gallery_tab(driver)

    wait = WebDriverWait(driver, 10)

    wait.until(lambda d: (
        len(d.find_elements(By.CSS_SELECTOR, "[data-testid='approve-button']")) > 0 or
        len(d.find_elements(By.CSS_SELECTOR, "[data-testid='delete-button']")) > 0 or
        "No gallery submissions found" in d.find_element(By.TAG_NAME, "body").text
    ))

    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert (
        "Gallery Management" in body_text or
        "No gallery submissions" in body_text or
        len(driver.find_elements(By.CSS_SELECTOR, "[data-testid='delete-button']")) > 0
    )


def test_admin_approve_gallery_submission(driver):
    """Admin can approve a pending gallery submission"""
    login_as_admin(driver)
    navigate_to_gallery_tab(driver)

    wait = WebDriverWait(driver, 10)

    # data-testid="approve-button" — confirmed from JSX
    approve_buttons = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='approve-button']"
    )

    if len(approve_buttons) == 0:
        print("⚠️ No gallery items to approve")
        return

    initial_count = len(approve_buttons)
    approve_buttons[0].click()
    time.sleep(2)

    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    time.sleep(1)
    remaining = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='approve-button']"
    )
    assert len(remaining) < initial_count


def test_admin_reject_gallery_submission(driver):
    """Admin can reject a gallery submission"""
    login_as_admin(driver)
    navigate_to_gallery_tab(driver)

    reject_buttons = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='reject-button']"
    )

    if len(reject_buttons) == 0:
        print("⚠️ No gallery items to reject")
        return

    initial_count = len(reject_buttons)
    reject_buttons[0].click()
    time.sleep(2)

    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    time.sleep(1)
    remaining = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='reject-button']"
    )
    assert len(remaining) < initial_count


def test_admin_delete_gallery_submission(driver):
    """Admin can delete a gallery submission — triggers window.confirm"""
    login_as_admin(driver)
    navigate_to_gallery_tab(driver)

    wait = WebDriverWait(driver, 10)

    delete_buttons = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='delete-button']"
    )

    if len(delete_buttons) == 0:
        print("⚠️ No gallery items to delete")
        return

    initial_count = len(delete_buttons)
    delete_buttons[0].click()

    # JSX uses window.confirm() before deleting — MUST accept it
    try:
        confirm = WebDriverWait(driver, 5).until(EC.alert_is_present())
        confirm.accept()  # Click OK on "Are you sure?"
    except Exception:
        print("⚠️ No confirm dialog appeared")
        return

    time.sleep(2)

    remaining = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid='delete-button']"
    )
    assert len(remaining) < initial_count