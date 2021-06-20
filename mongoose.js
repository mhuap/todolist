const mongoose = require('mongoose');
require('dotenv').config();

// mongoose.connect('mongodb://localhost:27017/todolist', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

async function dbConnect() {
  mongoose
    .connect(
        process.env.DB_URL,
      {
        //   these are options to ensure that the connection is done properly
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    )
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });

}

module.exports = dbConnect
