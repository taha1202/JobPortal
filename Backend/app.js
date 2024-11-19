const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
// const session = require('express-session');
const jobRoutes = require('./routes/jobRoutes'); 
const verifyToken = require('./middleware/verifyToken');

const app = express();


const PORT = 5000; // Declare PORT once
// Middleware to parse form data

app.use(express.json());
app.use(cors());



// const sessionSecret = process.env.SESSION_SECRET || 'fallback-secret-for-dev';
// app.use(
//   session({
//     secret: sessionSecret, // Replace with a strong secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false, // Allows cookies over HTTP
//       httpOnly: true, // Prevents access to cookies via JavaScript
//       sameSite: 'lax', // Restricts third-party cookie sharing
//       maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
//     }
//   })
// );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML file
app.use(express.static(path.join('C:', 'Users', 'Taha', 'Desktop', 'job portal', 'Frontend', 'public')));

// Route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join('C:', 'Users', 'Taha', 'Desktop', 'job portal', 'public', 'Frontend', 'index.html'));
});

app.use("/uploads", express.static("uploads"));
// Use routes
app.use('/api',userRoutes);
app.use('/api', verifyToken);
app.use('/api', jobRoutes);

// app.use('/uploads', express.static('uploads'));  // Serve static files

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
