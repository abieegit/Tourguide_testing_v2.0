"""
conftest.py — Shared setup for all Selenium tests
pytest automatically loads this file and makes 'driver' available to every test.
"""

import pytest
from selenium import webdriver
from selenium.webdriver.edge.options import Options


@pytest.fixture
def driver():
    """
    This function runs before every single test.
    It opens a fresh Edge browser window for each test,
    then closes it after the test finishes.
    """
    options = Options()
    options.add_argument("--start-maximized")  # Open browser in full screen

    # Selenium Manager automatically downloads the correct msedgedriver
    browser = webdriver.Edge(options=options)
    browser.implicitly_wait(5)  # Wait up to 5 seconds when looking for elements

    yield browser  # This gives the browser to the test

    browser.quit()  # This runs AFTER the test finishes — closes the browser