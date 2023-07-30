const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require("./routes/userRoutes")
const toursRoutes = require("./routes/tourRoutes")


const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/users',userRoutes )
app.use('/tours',toursRoutes )


// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});