const jwt = require("jsonwebtoken");
const student = require("./models/student");
const cookieparser = require("cookie-parser")
const middleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log(token, process.env.SECRET_KEY);
        const verifyuser = jwt.verify(token, process.env.SECRET_KEY);
        const data = await student.find({ _id: verifyuser._id });
        //console.log(data);
        next();
    } catch (error) {
        if (error) {
            console.log("page not found");
            res.render("login");
        }
    }
}
module.exports = middleware;