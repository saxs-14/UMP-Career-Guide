const express = require('express');
const cors = require('cors');
require('dotenv').config();

const courseRoutes = require('./routes/courseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', courseRoutes);

app.get('/', (req, res) => {
  res.send('UCAG Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
