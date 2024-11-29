const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
// const session = require('express-session');
const jobRoutes = require('./routes/jobRoutes'); 
const verifyToken = require('./middleware/verifyToken');
const profileRoutes = require('./routes/profileRouter'); 
const application = require('./routes/applicationRoutes');
const { GiveFeedBack, Getfeedback } = require('./controllers/FeedBackController');

const messageroute = require('./routes/MessageRoutes');
const { GetCategory } = require('./controllers/jobSearchController');
const app = express();


const PORT = 5000; // Declare PORT once
// Middleware to parse form data

app.use(express.json());
app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/uploads", express.static("uploads"));

app.get('/api/getfeedback',Getfeedback);
app.get('/api/getcategory',GetCategory);
app.use('/api',userRoutes);
app.use('/api', verifyToken);
app.use('/api', jobRoutes);
app.use('/api',profileRoutes);
app.use('/api', application);
app.post('/api/givefeedback',GiveFeedBack);

app.use('/api', messageroute);
const frontendPath = path.join(__dirname, '..', 'Frontend', 'public');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});



// app.use('/uploads', express.static('uploads'));  // Serve static files

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
