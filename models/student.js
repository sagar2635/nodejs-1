require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
studentSchema.pre("save", async function (next) {
    
    if (this.isModified("pwd")) {
        this.pwd = await bcrypt.hash(this.pwd, 10);
    }
    next();
})
studentSchema.methods.generateauthtoken = async function () {
    try {
        const thapa = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = { token: thapa };
        await this.save();
        return thapa;
    } catch (error) {
        console.log(error);
    }
}


const student = mongoose.model("student", studentSchema);
module.exports = student;