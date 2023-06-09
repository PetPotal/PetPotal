const Test01 = require("../models/Test01");
const Crypt = require("../middleware/Crypt");

exports.findAll = (req, res) => {
    Test01.findAll((err, test01) => {
        console.log("Test01 Controller findAll start");
        if(err) res.send(err);
        console.log("Test01 findAll result: ",  test01);
        res.send(test01);
    })
}

exports.findById = (req, res) => {
    Test01.findById(req.params.id, (err, test01) => {
        console.log("Test01 Controller findById start: ", test01);
        if(err) res.send(err);
        console.log("Test01 Controller finById result: ",  test01);
        res.send(test01);
    })
}

exports.insertRow = (req, res) => {
    Test01.insertRow((err, test01) => {
        console.log("Test01 insert row start");
        if(err) res.send(err);
        console.log("Test01 insert row result: ", test01);
        res.send(test01);
    })
}

exports.insertRow02 = (req, res) => {
    Test01.insertRow02(req.params, (err, test01) => {
        console.log("param:\n", req.params.column01);
        if(err) res.send(err);
        else {
            console.log("insertRow02 Controller result: ", req.params);
            res.send(test01);
        }
    })
}

exports.cryptTest = async (req, res) => {
    let result = await Crypt.encrypt(req.params.pw);
    console.log(result);
    res.send("Testing");
}