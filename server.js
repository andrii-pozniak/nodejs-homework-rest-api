const app = require("./app");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

const connectDB = async () => {
  try {
    await mongoose.connect(uriDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connect success`);
    app.listen(PORT, function () {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();

// connection
//   .then(() => {
//     console.log('Server started!')
   
//   })
//   .catch((error) => {
//     console.error(error.massage);
   
//   });
