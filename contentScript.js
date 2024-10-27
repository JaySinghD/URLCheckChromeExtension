// Function to process each search result link
function markSearchResults() {
  // Use a more specific selector to target only the main search result links
  const searchResults = document.querySelectorAll('.g a'); // Adjust if needed

  searchResults.forEach((link) => {
    const url = link.href;

    // Send message to background service worker to check URL safety
    chrome.runtime.sendMessage({ type: 'checkUrlSafety', url }, (response) => {
      // Placeholder to check if the URL is dangerous
      const isDangerous = response.isDangerous; // response.isDangerous should be provided by background.js

      // Create an icon element
      const icon = document.createElement('img');
      icon.style.width = '16px';
      icon.style.height = '16px';
      icon.style.marginLeft = '5px';

      // Set icon based on safety status
      if (isDangerous) {
        icon.src = chrome.runtime.getURL('assets/delete.png'); // X icon
        icon.alt = 'Unsafe';

        // Prevent navigation to dangerous URLs and show confirmation
        link.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent link from opening
          
          // Show confirmation dialog to the user
          const userConfirmed = confirm(
            `Warning: The website you are trying to open (${url}) has been flagged as unsafe. Do you still want to proceed?`
          );

          // Open the URL in a new tab if the user confirms
          if (userConfirmed) {
            window.open(url, '_blank');
          }
        });
      } else {
        icon.src = chrome.runtime.getURL('assets/save.png'); // Checkmark icon
        icon.alt = 'Safe';
      }

      // Append icon to each search result link
      link.appendChild(icon);
    });
  });
}

// Run the function when the page loads
window.addEventListener('load', markSearchResults);