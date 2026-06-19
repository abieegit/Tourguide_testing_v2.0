"""
Test File: Admin Booking Management
Mirrors Cypress adminBookings.cy.js
TC-10, TC-10b

IMPORTANT: Admin dashboard is a SINGLE PAGE APPLICATION.
All tabs (deals, bookings, queries, gallery) live at /admin/dashboard.
There are NO separate routes like /admin/bookings.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"


def login_as_admin(driver):
    """Helper: Log in as admin and reach dashboard"""
    driver.get(f"{BASE_URL}/admin")
    wait = WebDriverWait(driver, 10)

    driver.find_element(By.ID, "username").send_keys("admin")
    driver.find_element(By.ID, "password").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(EC.url_contains("/dashboard"))


def navigate_to_bookings_tab(driver):
    """Helper: Click the Bookings tab in sidebar"""
    wait = WebDriverWait(driver, 10)

    bookings_tab = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Bookings')]")
    ))
    bookings_tab.click()
    time.sleep(1.5)  # Wait for bookings data to load from API


def test_admin_bookings_tab_loads(driver):
    """TC-10-PRE: Bookings tab loads and shows table or empty state"""
    login_as_admin(driver)
    navigate_to_bookings_tab(driver)

    wait = WebDriverWait(driver, 10)

    # Either a table exists or empty message — both are valid
    wait.until(lambda d: (
        len(d.find_elements(By.TAG_NAME, "table")) > 0 or
        "No bookings found" in d.find_element(By.TAG_NAME, "body").text
    ))

    has_table = len(driver.find_elements(By.TAG_NAME, "table")) > 0
    has_empty = "No bookings found" in driver.find_element(By.TAG_NAME, "body").text

    assert has_table or has_empty


def test_admin_approve_pending_booking(driver):
    """TC-10: Admin can approve a pending booking from bookings tab"""
    login_as_admin(driver)
    navigate_to_bookings_tab(driver)

    wait = WebDriverWait(driver, 10)

    # Approve buttons only appear for pending bookings
    # Actual JSX: plain button with text "Approve" — no data-testid
    approve_buttons = driver.find_elements(
        By.XPATH, "//button[normalize-space(text())='Approve']"
    )

    if len(approve_buttons) == 0:
        print("⚠️ No pending bookings found to approve — create a booking first")
        return

    # Get the first approve button
    first_approve = approve_buttons[0]

    # Find its parent row to capture status before click
    first_approve.click()
    time.sleep(2)

    # Handle any alert after approval
    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    time.sleep(1.5)

    # Verify: Approve button should no longer exist for that row
    # OR the status badge should change to 'approved'
    remaining_approves = driver.find_elements(
        By.XPATH, "//button[normalize-space(text())='Approve']"
    )

    # One less approve button means it worked
    assert len(remaining_approves) < len(approve_buttons)


def test_admin_reject_pending_booking(driver):
    """TC-10b: Admin can reject a pending booking from bookings tab"""
    login_as_admin(driver)
    navigate_to_bookings_tab(driver)

    wait = WebDriverWait(driver, 10)

    # Reject buttons appear for both pending AND approved bookings
    reject_buttons = driver.find_elements(
        By.XPATH, "//button[normalize-space(text())='Reject']"
    )

    if len(reject_buttons) == 0:
        print("⚠️ No rejectable bookings found — all may be paid or already rejected")
        return

    initial_count = len(reject_buttons)
    reject_buttons[0].click()
    time.sleep(2)

    try:
        alert = WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert.accept()
    except Exception:
        pass

    time.sleep(1.5)

    remaining_rejects = driver.find_elements(
        By.XPATH, "//button[normalize-space(text())='Reject']"
    )

    assert len(remaining_rejects) < initial_count


def test_admin_booking_status_badge_visible(driver):
    """TC-10c: Booking status badges display correctly in table"""
    login_as_admin(driver)
    navigate_to_bookings_tab(driver)

    wait = WebDriverWait(driver, 10)

    # Check if table exists
    tables = driver.find_elements(By.TAG_NAME, "table")
    if len(tables) == 0:
        print("⚠️ No bookings table — skipping badge check")
        return

    # Status badges use data-testid="booking-status-{id}"
    status_badges = wait.until(EC.presence_of_all_elements_located(
        (By.CSS_SELECTOR, "[data-testid^='booking-status-']")
    ))

    assert len(status_badges) > 0

    # Verify at least one badge has valid status text
    valid_statuses = {"pending", "approved", "rejected", "paid", "unpaid"}
    for badge in status_badges[:3]:  # Check first 3
        assert badge.text.lower() in valid_statuses 