const m = require("../model/link");

exports.submit = (req, res) => {
    m.submit(req, res);
}

exports.generateNewLink = (req, res) => {
    m.generateNewLink(req, res);
}

exports.timeConfirm = (req, res) => {
    m.timeConfirm(req, res);
}