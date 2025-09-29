# URLCheck Chrome Extension (Prototype)

A **prototype Google Chrome extension** that adds a ✅ or ❌ next to each Google search result link as a proof-of-concept for a malicious URL detection tool.

> ⚠️ **Note:** This version does **not** yet include the planned convolutional neural network (CNN) for URL classification. It only shows placeholder icons.

## Features
- Injects a checkmark or X beside Google search result links.
- Demonstrates how the extension’s content script and popup UI work together.
- Serves as a UI proof-of-concept for a future AI-powered malicious URL classifier.

The following is an image that shows the extention's functionality:
![gallery-1](https://github.com/user-attachments/assets/c3ae91e1-620f-4ab3-878b-706fa675d70e)


## Planned Next Steps
- Integrate a **convolutional neural network (CNN)** model to classify URLs as benign or malicious.
- Expand beyond Google search results to other pages.
- Improve the popup UI and add model inference in real time.

## Installation
1. Download or clone this repository:
   bash
   git clone https://github.com/JaySinghD/URLCheckChromeExtension.git

2. In Chrome, navigate to chrome://extensions/.

3. Enable Developer mode (toggle in the top right).

4. Click Load unpacked and select the project folder.

5. The extension should now appear in your extensions list and inject icons next to Google search results.

## Disclaimer
⚠️ This is an early prototype. The extension does not actually evaluate link safety yet. It only displays placeholder icons. Do not rely on it for security decisions.

## License
MIT License
