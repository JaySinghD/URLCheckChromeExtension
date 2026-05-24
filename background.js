let urlSafetyCache = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'checkUrlSafety') {
    const { url } = request;

    // Return cached result if available
    if (urlSafetyCache[url] !== undefined) {
      sendResponse({ isDangerous: urlSafetyCache[url] });
      return true;
    }

    // Call live Python backend
    fetch('https://urlcheckchromeextension.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
      const isDangerous = data.isDangerous;
      urlSafetyCache[url] = isDangerous; // Cache the real result
      sendResponse({ isDangerous });
    })
    .catch(error => {
      console.error('API Error:', error);
      // Fail safely if the server is down
      sendResponse({ isDangerous: false }); 
    });

    return true; // Keeps the messaging channel open for the async fetch
  }
});
