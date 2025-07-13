/**
 * Test script để kiểm tra z-index của dropdown trong mail system
 * Chạy script này trong browser console để kiểm tra
 */

console.log("🔍 Testing dropdown z-index in mail system...");

// Kiểm tra z-index của navbar
const navbar = document.querySelector('.navbar-top, .ct-navbar');
if (navbar) {
  const navbarZIndex = window.getComputedStyle(navbar).zIndex;
  console.log(`📊 Navbar z-index: ${navbarZIndex}`);
} else {
  console.log("❌ Navbar not found");
}

// Kiểm tra z-index của DateFilterNew dropdown
const dateFilterDropdown = document.querySelector('.date-filter-container .dropdown-menu');
if (dateFilterDropdown) {
  const dropdownZIndex = window.getComputedStyle(dateFilterDropdown).zIndex;
  console.log(`📊 DateFilter dropdown z-index: ${dropdownZIndex}`);
} else {
  console.log("❌ DateFilter dropdown not found");
}

// Kiểm tra z-index của mail actions dropdown
const mailActionsDropdown = document.querySelector('.mail-actions-dropdown .dropdown-menu');
if (mailActionsDropdown) {
  const actionsZIndex = window.getComputedStyle(mailActionsDropdown).zIndex;
  console.log(`📊 Mail actions dropdown z-index: ${actionsZIndex}`);
} else {
  console.log("❌ Mail actions dropdown not found");
}

// Kiểm tra tất cả dropdown menus trong mail pages
const allDropdowns = document.querySelectorAll('.mail-page .dropdown-menu, .mail-system .dropdown-menu');
console.log(`📊 Found ${allDropdowns.length} dropdown menus in mail system`);

allDropdowns.forEach((dropdown, index) => {
  const zIndex = window.getComputedStyle(dropdown).zIndex;
  console.log(`  Dropdown ${index + 1}: z-index = ${zIndex}`);
});

// Kiểm tra CSS classes
const mailPages = document.querySelectorAll('.mail-page, .mail-system');
console.log(`📊 Found ${mailPages.length} mail page containers`);

// Test function để mở dropdown và kiểm tra
function testDropdownVisibility() {
  console.log("🧪 Testing dropdown visibility...");
  
  // Tìm và click vào DateFilter dropdown
  const dateFilterToggle = document.querySelector('.date-filter-container .dropdown-toggle');
  if (dateFilterToggle) {
    dateFilterToggle.click();
    setTimeout(() => {
      const openDropdown = document.querySelector('.date-filter-container .dropdown-menu.show');
      if (openDropdown) {
        const rect = openDropdown.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.left >= 0 && 
                         rect.bottom <= window.innerHeight && 
                         rect.right <= window.innerWidth;
        console.log(`✅ DateFilter dropdown is ${isVisible ? 'visible' : 'hidden/clipped'}`);
        console.log(`📍 Position: top=${rect.top}, left=${rect.left}, bottom=${rect.bottom}, right=${rect.right}`);
      }
    }, 100);
  }
}

// Export test function
window.testDropdownVisibility = testDropdownVisibility;

console.log("✅ Z-index test completed. Run testDropdownVisibility() to test dropdown visibility.");
