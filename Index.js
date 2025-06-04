import app from './app.js';
import userRoutes from './routes/userRoutes.js';


app.use('/api/users', userRoutes);


// Set up a route
app.get('/', (req, res) => {
    res.send('Hello World!' + ' ' + process.env.APP_NAME);
});

// Define the port (use environment variable or default to 3000)
const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});