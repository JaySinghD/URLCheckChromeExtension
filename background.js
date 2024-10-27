// Sample URL safety cache (in practice, this could be an API call)
let urlSafetyCache = {};

// Listen for requests to check URL safety from contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'checkUrlSafety') {
    const { url } = request;

    // Simulated check: Example API or predefined logic
    const isDangerous = urlSafetyCache[url] || Math.random() < 0.3; // Randomly assign "dangerous" status as a placeholder

    // Cache the result for future requests
    urlSafetyCache[url] = isDangerous;

    // Send back the response with the "isDangerous" status
    sendResponse({ isDangerous });
    return true; // Keeps the messaging channel open for asynchronous sendResponse
  }
});