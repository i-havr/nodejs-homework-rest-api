require('dotenv').config();
const { connectMongo } = require('./src/db/connection');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectMongo();

    app.listen(PORT, err => {
      if (err) console.error('Error at a server launch:', err);
      console.log('Database connection successful');
    });
  } catch (error) {
    console.error(`Failed to launch application with error: ${error.message}`);
    process.exit(1);
  }
};

start();
