require('dotenv').config();

const express = require('express');
const configViewEngine = require('./config/viewEngine');
const connectDB = require('./config/configdb');
const initWebRoutes = require('./routes/web.js');
const cors = require('cors');
const { getHomePage } = require('./controllers/homeControllers.js');
const apiRoutes = require('./routes/api');
const { connectElastic } = require('./config/elastic.js');
  
const app = express();
const port = process.env.PORT || 8888;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

const webAPI = express.Router();
webAPI.get('/', getHomePage);
app.use('/', webAPI);
app.use('/v1/api', apiRoutes);

// initWebRoutes(app);
connectDB();
connectElastic(); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});