# URLCheck Chrome Extension
## Features
- Injects a checkmark or X beside Google search result links.
- Demonstrates how the extension’s content script and popup UI work together.
- Serves as a UI proof-of-concept for a future AI-powered malicious URL classifier.

The following is an image that shows the extention's functionality (Proof of concept - does not show the actual CNN clasification):
![gallery-1](https://github.com/user-attachments/assets/c3ae91e1-620f-4ab3-878b-706fa675d70e)

## Planned Next Steps
- ~~Integrate a **convolutional neural network (CNN)** model to classify URLs as benign or malicious.~~ DONE
- Integrate the CNN with the Chrome Extention (as of now the chrome extenstion does not take the classification results from the CNN, and instead gives random outputs)
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

## License
MIT License
