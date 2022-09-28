const con = require('../DB/mysql');
const siteLink = "http://92.205.128.43:80";

//  submit
exports.submit = async (req, res) => {
    console.log('submit : token- ')
    let { token } = req.query;
    console.log(token);
    const IP = req.ip.replace('::ffff:', '');
    let token_ = token.replaceAll("'", "");
    console.log(token_);
    console.log(IP);

    try {
        const tokenQuery = `SELECT * FROM users WHERE token="${token_}"`;
        con.query(tokenQuery, function (err, token_result) {
            if (err) throw err;
            if (token_result.length > 0) {
                console.log('token_result : ');
                console.log(JSON.stringify(token_result));
                // ip select
                const ipQuery = `SELECT * FROM users WHERE ip="${IP}"`;
                con.query(ipQuery, function (err, result1) {
                    if (err) throw err;
                    console.log('IP select')
                    console.log(result1);

                    if (result1.length > 0) {
                        // already registed-> success
                        console.log('already registed IP')
                        res.redirect(`${siteLink}/start-presale`);
                    } else {
                        // Reject different IP
                        console.log('result[0].ip ; ', token_result[0].ip)

                        if (token_result[0].ip == null) {
                            // Ip and time insert -> success
                            console.log(result1)
                            console.log('Ip and time insert')
                            let currentTime;
                            getTimeNow(function (nowTime) {
                                currentTime = nowTime;
                            });
                            const updateaQuery = `UPDATE users SET ip = '${IP}', time = '${currentTime}' WHERE token='${token_}'`;
                            con.query(updateaQuery, function (err, result2) {
                                if (err) throw err;
                                res.redirect(`${siteLink}/start-presale`);
                            });
                        } else {
                            if (token_result[0].ip !== IP) {
                                console.log('different IP')
                                console.log(IP)
                                res.redirect(`${siteLink}/page-not-found`);
                            } else if (token_result[0].ip == IP) {
                                res.redirect(`${siteLink}/start-presale`);
                            }
                        }
                    }
                });

            } else {
                // failed
                console.log('failed')
                res.redirect(`${siteLink}/page-not-found`);

            }
        })

        // console.log(res);
    } catch (error) {
        console.log(error)
    }
};

exports.generateNewLink = async (req, res) => {
    try {
        console.log('generateNewLink')
        const query = `SELECT COUNT(*) AS count FROM users`;
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log(result[0].count)
            const token = result[0].count + '000presale'
            const query1 = `INSERT INTO users(token) VALUES('${token}')`;
            con.query(query1, function (err, result1) {
                if (err) throw err;
                res.send(token);
            });
        });
    } catch (error) {
        console.log(error)
        throw err
    }
};

exports.timeConfirm = async (req, res) => {
    const IP = req.ip.replace('::ffff:', '');
    try {
        // const q1 = `UPDATE opinion SET b_up = '${result1[0].b_down}', b_down = '${result1[0].b_up}', b_revert = 1 WHERE c_proposal_id = '${pk}'`;
        _timeConfirm(IP, res)
    } catch (error) {
        console.log(error)
    }
};



// *** Share ***
// up or down test
const getTimeNow = (callback) => {
    try {
        let time = (Math.round(new Date()) / 1000).toFixed(0);
        callback(time);
    } catch (error) {
        console.log('getTimeNow : ')
        console.log(error)
    }
}

const _timeConfirm = (IP, res) => {
    const ipQuery = `SELECT * FROM users WHERE ip = "${IP}"`;
    console.log('timeConfirm IP', IP);
    con.query(ipQuery, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            console.log('check time')
            if (result[0].ip === IP) {
                getTimeNow(function (currentTime) {
                    console.log(currentTime - result[0].time > 30)
                    if ((Number(currentTime) - Number(result[0].time)) > 180) {//24 * 3600 = 1days  //
                        console.log('time expried')
                        res.send(`expried`);
                    } else {
                        console.log(result[0].time)
                        console.log(currentTime)
                        console.log('you can use the site yet')
                        res.send('available');
                    }
                })
            } else {
                res.redirect(`${siteLink}/page-not-found`);
            }
        } else {
            console.log('_timeConfirm -> page-not-found')
            res.redirect(`${siteLink}/page-not-found`);
        }
    });
}
