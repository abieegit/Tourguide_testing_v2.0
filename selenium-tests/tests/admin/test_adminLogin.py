"""
Test File: Admin Login
TC-09 to TC-09c
Verified against AdminDashboard.jsx:
- Auth check: localStorage.getItem("tb_is_admin") === "true"
- Redirect on no session: navigate("/admin", { replace: true })
- Logout: localStorage.removeItem("tb_is_admin") → navigate("/admin")
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"


def test_admin_valid_login_reaches_dashboard(driver):
    """TC-09: Valid admin credentials redirect to /dashboard"""
    driver.get(f"{BASE_URL}/admin")
    wait = WebDriverWait(driver, 10)

    driver.find_element(By.ID, "username").send_keys("admin")
    driver.find_element(By.ID, "password").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(EC.url_contains("/dashboard"))
    assert "/dashboard" in driver.current_url


def test_admin_invalid_credentials_shows_error(driver):
    """TC-09b: Wrong credentials show error"""
    driver.get(f"{BASE_URL}/admin")
    wait = WebDriverWait(driver, 10)

    driver.find_element(By.ID, "username").send_keys("wrongadmin")
    driver.find_element(By.ID, "password").send_keys("wrongpass")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    try:
        alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
        text = alert.text
        alert.accept()
        assert len(text) > 0
    except Exception:
        time.sleep(1)
        body = driver.find_element(By.TAG_NAME, "body").text
        assert "invalid" in body.lower() or "incorrect" in body.lower()


def test_admin_dashboard_blocked_without_session(driver):
    """TC-09c: Direct /admin/dashboard access without session redirects to /admin"""
    # Fresh browser — no localStorage session
    driver.get(f"{BASE_URL}/dashboard")
    wait = WebDriverWait(driver, 10)

    # JSX checks localStorage("tb_is_admin") and redirects to /admin if missing
    wait.until(lambda d: d.current_url == f"{BASE_URL}/admin" or
                         d.current_url == f"{BASE_URL}/admin")

    assert driver.current_url.rstrip("/").endswith("/admin")
    assert "/dashboard" not in driver.current_url


def test_admin_logout_redirects_to_admin_login(driver):
    """TC-09d: Admin logout clears tb_is_admin and redirects to /admin"""
    driver.get(f"{BASE_URL}/admin")
    wait = WebDriverWait(driver, 10)

    # Login first
    driver.find_element(By.ID, "username").send_keys("admin")
    driver.find_element(By.ID, "password").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    wait.until(EC.url_contains("/dashboard"))

    # Click logout — class confirmed from JSX: test-admin-desktop-logout
    logout_btn = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, ".test-admin-desktop-logout")
    ))
    logout_btn.click()
    time.sleep(1)

    # JSX: navigate("/admin", { replace: true }) after logout
    wait.until(lambda d: "/admin/dashboard" not in d.current_url)
    assert "/admin/dashboard" not in driver.current_url
    assert "/admin" in driver.current_url