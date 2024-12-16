// const express = require("express");
// const cors = require("cors");  // Import the cors package
// const { MongoDBConnect } = require("./conncetion");
// const cookieParser = require('cookie-parser');
// const userRouter = require("./routes/user");
// const adminRoutes = require('./routes/adminRoutes');
// const bookRoutes = require('./routes/bookRoutes');
// const authorRoutes = require('./routes/authorRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');  // Import category routes
// const borrowRoutes = require('./routes/borrowRoutes');  // Import category routes
// const libraryRoutes = require('./routes/libraryRoutes');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cookieParser());
// const dotenv = require('dotenv');

// dotenv.config();

// // Enable CORS for all origins
// app.use(cors());  

// // If you want to allow only specific origins, you can configure it like this:
// // app.use(cors({ origin: 'http://localhost:3001' }));  // Allow requests from localhost:3001

// // Connection to Database
// // MongoDBConnect("mongodb+srv://oximiteodl:yasir%40odl45455@cluster0.5pgjybj.mongodb.net/Library_System?retryWrites=true&w=majority&appName=Cluster0")
//  MongoDBConnect("mongodb+srv://oximiteodl:yasir%40odl45455@cluster0.5pgjybj.mongodb.net/Library_System?retryWrites=true&w=majority&ssl=true")

// app.get("/", (req, res) => {
//     res.send("Hello There");
// });

// app.use("/user", userRouter);
// app.use("/admin", adminRoutes);
// app.use("/books", bookRoutes);
// app.use("/author", authorRoutes);
// app.use("/category", categoryRoutes);
// app.use("/borrow", borrowRoutes);
// app.use('/library', libraryRoutes);

// app.listen(PORT, () => {
//     console.log("Server Started on", PORT);
// });

const cluster = require("node:cluster");
const os = require("os");
const express = require("express");
const cors = require("cors"); 
const { MongoDBConnect } = require("./conncetion");
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user");
const adminRoutes = require('./routes/adminRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); 
const borrowRoutes = require('./routes/borrowRoutes'); 
const libraryRoutes = require('./routes/libraryRoutes');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Primary ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    // Worker processes
    const app = express();
    const PORT = process.env.PORT;
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.use(express.json());
    app.use(cookieParser());

    // Enable CORS for all origins
    app.use(cors());  

    // Connect to MongoDB cluster
    MongoDBConnect("mongodb+srv://oximiteodl:yasir%40odl45455@cluster0.5pgjybj.mongodb.net/Library_System?retryWrites=true&w=majority&appName=Cluster0");

    app.get("/server", (req, res) => {
        res.send(`Hello from Worker ${process.pid}`);
    });

    // Routes
    app.use("/user", userRouter);
    app.use("/admin", adminRoutes);
    app.use("/books", bookRoutes);
    app.use("/author", authorRoutes);
    app.use("/category", categoryRoutes);
    app.use("/borrow", borrowRoutes);
    app.use('/library', libraryRoutes);

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
}
