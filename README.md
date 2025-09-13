# QR Generator & Scanner

Simple client-side web app to generate QR codes and scan them using the device camera.

## Files
- `index.html` — main UI
- `styles.css` — styles
- `script.js` — javascript logic, uses `qrcodejs` for generation and `html5-qrcode` for scanning

## How to use
1. Clone or download the files and open `index.html` in a modern browser.
2. For scanning, allow the page to access the camera.

## Notes
- The scanner depends on `html5-qrcode` which works well on mobile and desktop browsers that expose cameras.
- If camera permission is denied, the scanner will not start.

## License
MIT