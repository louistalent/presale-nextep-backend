const express = require('express');
const router = express.Router();
const model = require("../model/link");
const siteLink = "http://92.205.128.43";
// const siteLink = "http://localhost:3000";

router.get('/submit', (req, res) => {
    try {
        const result = model.submit(req, res);
        if (result == 'page-not-found') {
            res.redirect(`${siteLink}/page-not-found`);
        } else {
            res.redirect(`${siteLink}/start-presale`);
        }
    } catch (error) {
        console.log(error);
        res.status(404).send("system error");
    }
});

router.post('/generateNewLink', async (req, res) => {
    try {
        const token = await model.generateNewLink(req, res);
        if (token !== null) return res.send(token);
        res.status(404).send("failed to generate token");
    } catch (error) {
        res.status(404).send("system error");
    }
});

router.post('/timeConfirm', async (req, res) => {
    try {
        model.timeConfirm(req, res)
    } catch (error) {
        console.log(error);
        res.status(404).send("system error");
    }
});

router.post('/deleteAll', async (req, res) => {
    try {
        let result = await model.deleteAll();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(404).send("system error");
    }
});

module.exports = router;