const express = require('express');
const app = express()
const AppRouter = require("./index.Router.js");

const dotenv = require('dotenv');
dotenv.config()

AppRouter(app);

// Set up server to listen on specified port (default to 3000)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
