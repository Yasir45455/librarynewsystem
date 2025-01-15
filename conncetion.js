const mongoose = require("mongoose");

async function MongoDBConnect(url) {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

module.exports = {
    MongoDBConnect,
};


// const mongoose = require("mongoose");

// async function MongoDBConnect(url) {
//     try {
//         await mongoose.connect(url, {
//             connectTimeoutMS: 30000, // 30 seconds timeout
//             useNewUrlParser: true,   // Ensures use of the new URL parser
//             useUnifiedTopology: true // Opts into the MongoDB driver's new connection management engine
//         });
//         console.log("MongoDB connected successfully.");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// }

// module.exports = {
//     MongoDBConnect,
// };
