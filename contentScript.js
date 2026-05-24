// Function to process each search result link
function markSearchResults() {
  // Target search links, but ONLY ones we haven't scanned yet to prevent infinite loops
  const searchResults = document.querySelectorAll('.g a:not([data-scanned="true"])'); 

  searchResults.forEach((link) => {
    const url = link.href;

    // Mark as scanned immediately
    link.setAttribute('data-scanned', 'true');

    // Ignore empty links or internal Google utility links (like "Images", "News", etc.)
    if (!url || url.startsWith('https://www.google.com') || url.startsWith('javascript:')) {
        return; 
    }

    // Send message to background service worker to check URL safety
    chrome.runtime.sendMessage({ type: 'checkUrlSafety', url }, (response) => {
      // Safety check in case the connection was lost or response is undefined
      if (!response) return; 

      const isDangerous = response.isDangerous;

      // Create an icon element
      const icon = document.createElement('img');
      icon.style.width = '16px';
      icon.style.height = '16px';
      icon.style.marginLeft = '5px';
      icon.style.verticalAlign = 'middle'; // Helps align the icon with text

      // Set icon based on safety status
      if (isDangerous) {
        icon.src = chrome.runtime.getURL('assets/delete.png'); 
        icon.alt = 'Unsafe';

        // Prevent navigation to dangerous URLs and show confirmation
        link.addEventListener('click', (event) => {
          event.preventDefault(); 
          
          const userConfirmed = confirm(
            `Warning: The website you are trying to open (${url}) has been flagged as unsafe. Do you still want to proceed?`
          );

          if (userConfirmed) {
            window.open(url, '_blank');
          }
        });
      } else {
        icon.src = chrome.runtime.getURL('assets/save.png'); 
        icon.alt = 'Safe';
      }

      // Append icon to the search result link
      link.appendChild(icon);
    });
  });
}

// 1. Run the function once immediately just in case results are already there
markSearchResults();

// 2. Set up a MutationObserver to watch for Google injecting new results dynamically
const observer = new MutationObserver(() => {
  markSearchResults();
});

// Start observing the entire document body for any child elements being added/removed
observer.observe(document.body, { childList: true, subtree: true });
