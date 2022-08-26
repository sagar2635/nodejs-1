require("dotenv").config()
const express = require("express");
const app = express();
const db = require("./config/mongoose");
const port = 8000;
const student = require("./models/student")
const middleware = require("./middleware");
const cookieparser = require("cookie-parser");
app.use(express.urlencoded());


app.use(cookieparser());


require("dotenv").config()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    const g=req.cookies.jwt;
    if (g) {
        student.find({}, function (err, data) {
            if (err) {
                res.render("view", { "err": "not any data" })
            }
            res.render("view", { data: data })
        })
    }
    else
    {
        res.render("index");
    }
})

app.get("/login", (req, res) => {
    const g = req.cookies.jwt;
    if (g) {
        student.find({}, function (err, data) {
            if (err) {
                res.render("view", { "err": "not any data" })
            }
            res.render("view", { data: data })
        })
    }
    else {
        res.render("login");
    }
})
app.post("/view", (req, res) => {
    student.findOne({ "email": req.body.email }, async (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            if (data.email !== req.body.email) {
                //console.log(req.body.name)
                console.log("register successfully");
            }
            else {
                console.log("email all ready exist");
            }
        }
        else {
            if (req.body.pwd === req.body.cpwd) {
                const studentsRegister = new student({
                    name: req.body.name,
                    age: req.body.age,
                    email: req.body.email,
                    pwd: req.body.pwd
                })
                const token = await studentsRegister.generateauthtoken();
                res.cookie("jwt", token, { expires: new Date(Date.now() + 500000), httpOnly: true });
                const register = await studentsRegister.save();

                //  console.log(register);
                student.find({}, function (err, data) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    res.render("view", {
                        data: data
                    })
                })
            }
            else {
                console.log("invalid pwd and cpwd");
            }
        }
    })
})
app.get("/view",middleware, (req, res) => {

    student.find({}, function (err, data) {
        if (err) {
            res.render("view", { "err": "not any data" })
        }
        res.render("view", { data: data })
    })


})
app.get("/home",middleware,(req, res) => {
    res.render("home");
})
app.post("/login", async (req, res) => {
    try {
        let studentr = await student.findOne({ email: req.body.email }) 
        console.log(req.body.pwd,studentr.pwd);
        const isCorrect = await bcrypt.compare(req.body.pwd,studentr.pwd);
        console.log(isCorrect);
        
         
        
        const token = await studentr.generateauthtoken();
        res.cookie("jwt", token, { expires: new Date(Date.now() + 500000), httpOnly: true });

        if (isCorrect) {
            student.find({}, function (err, data) {
                if (err) {
                    console.log(err);
                    return false;
                }
                res.render("view", {
                    data: data
                })
            })
        }
        else {
            console.log("password not match");
            res.render('login')
        }
    }
    catch (e) {
        console.log(e)
        console.log("email and password are not correct");
        res.render("login");
    }
})


app.get("/delete/:id",middleware, (req, res) => {

    student.findByIdAndDelete(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            res.render("/");
        }
        console.log("delete successfully");
        student.find({}, function (err, data) {
            if (err) {
                console.log(err);
                return false;
            }
            console.log(data);
            res.render("view", { data: data });
        })

    })
})

app.get("/name/:name",middleware, (req, res) => {


    //console.log(req.params.nam);
    student.find({ "name": req.params.name }, function (err, data) {
        if (err) {
            console.log("not match");
            res.render("view");
        }
        else {
            // console.log(detaildata)
            res.render("view", {
                data: data
            })
        }
    })
})

app.get('/api/', (req, res) => {
    res.send('Success');
})
app.post('/api/register', (req, res) => {
    student.findOne({ "email": req.body.email }, async (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            if (data.email !== req.body.email) {
                //console.log(req.body.name)
                console.log("register successfully");
            }
            else {
                console.log("email all ready exist");
            }
        }
        else {
            if (req.body.pwd === req.body.cpwd) {
                let data = {};
                const studentsRegister = new student({
                    name: req.body.name,
                    age: req.body.age,
                    email: req.body.email,
                    pwd: req.body.pwd
                })
                const token = await studentsRegister.generateauthtoken();
                res.cookie("jwt", token, { expires: new Date(Date.now() + 500000), httpOnly: true });
                const register = await studentsRegister.save();
                if (register) {
                    data['name'] = register.name;
                    data['email'] = register.email;
                    data['token'] = register.tokens[0].token;
                    
                    res.status(200).json(data);
                }
                else {
                    
                    res.status(503).send('Not registered');
                }
                //  console.log(register);
                // student.find({}, function (err, data) {
                //     if (err) {
                //         console.log(err);
                //         return false;
                //     }
                //     res.json(data);
                // })
            }
            else {
                console.log("invalid pwd and cpwd");
            }
        }
    })
})
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

