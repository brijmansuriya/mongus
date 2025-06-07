import app from './app.js';
import userRoutes from './routes/userRoutes.js';
import config from './config/env.js';


app.use('/api/users', userRoutes);


// Set up a route
app.get('/', (req, res) => {
    res.send('Hello World!' + ' ' + process.env.APP_NAME);
});

// Start the server using config
const port = config.PORT;
app.listen(port, () => {
    console.log(`${config.APP_NAME} listening at http://localhost:${port} in ${config.NODE_ENV} mode`);
});