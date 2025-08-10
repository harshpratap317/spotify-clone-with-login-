const express = require('express');
const path = require('path');
const app = express();

// Serve your HTML/CSS/JS from the current folder
app.use(express.static(path.join(__dirname)));

// Listen on ALL network interfaces
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running at:');
  console.log('Local:    http://127.0.0.1:3000');
  console.log('Network:  http://YOUR_LAPTOP_IP:3000');
});
