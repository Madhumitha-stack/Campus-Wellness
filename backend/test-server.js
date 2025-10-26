console.log('Starting minimal server test...');

const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, () => {
  console.log(`✅ Minimal server running on port ${PORT}`);
});