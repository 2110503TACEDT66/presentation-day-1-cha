const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

//load env vars
dotenv.config({path:'./config/config.env'});

//connect to database
connectDB();

//Route files
const providers = require('./routes/providers');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');
const calendar = require('./routes/calendar'); 

const app = express();

//body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

app.use('/api/v1/providers', providers);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/calendar',calendar);

const PORT=process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server& exit process
    server.close(() => process.exit(1));
});