const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/college", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("err", console.error.bind("err", "mongodb is not connected"))
db.once("open", function (err) {
    if (err) {
        console.log(err);
        return false;
    }
    console.log("db is connected");
});
module.exports = db;