const express = require('express');
const app = express();
app.use(express.json());

app.get('/get', (req, res) => res.send('This is GET route'));
app.post('/post', (req, res) => res.json({ message: 'Received POST', body: req.body }));

app.listen(3000, () => console.log('Server running'));
