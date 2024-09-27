const express = require('express');
const sequelize = require('./db');
const productRoutes = require('./routes/products'); 
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api', productRoutes);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
