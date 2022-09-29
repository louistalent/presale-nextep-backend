const { v4: uuidv4 } = require('uuid');
const { connection, execute } = require('../DB/mysql');

//  submit
exports.submit = async (req, res) => {
    console.log('submit : token- ')
    let { token } = req.query;
    console.log(token);
    let IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (IP === "::1") IP = "127.0.0.1";
    console.log("req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress")
    console.log(req.ip, req.headers['x-forwarded-for'], req.socket.remoteAddress)

    try {
        const tokenQuery = `SELECT * FROM users WHERE token="${token}"`;
        let token_result = await execute(tokenQuery);
        if (token_result.err) throw err;
        if (token_result.length > 0) {
            // ip select
            const ipQuery = `SELECT * FROM users WHERE ip="${IP}"`;
            let result1 = await execute(ipQuery);
            if (result1.err) throw result1.err;
            console.log('IP select')
            console.log(result1);
            console.log(token_result);

            if (result1.length > 0) {
                // already registed-> success
                console.log('already registed IP')
                return "success";
            } else {
                // Reject different IP
                console.log('token_result ; ', token_result);
                console.log('token_result[0].ip ; ', token_result[0].ip)


                if (token_result[0].ip == null) {
                    // Ip and time insert -> success
                    console.log(result1)
                    console.log('Ip and time insert -> ip = null')
                    let currentTime;
                    getTimeNow(function (nowTime) {
                        currentTime = nowTime;
                    });
                    const updateaQuery = `UPDATE users SET ip = '${IP}', time = '${currentTime}' WHERE token='${token}'`;
                    const result2 = await execute(updateaQuery);
                    if (result2) throw err;
                    return "success";
                } else {
                    if (token_result[0].ip !== IP) {
                        console.log('different IP')
                        console.log(IP)
                        return "page-not-found";
                    } else if (token_result[0].ip == IP) {
                        return "success";
                    }
                }
            }

        } else {
            // failed
            console.log('failed')
            return "page-not-found";
        }

        // console.log(res);
    } catch (error) {
        console.log(error)
    }
};

exports.generateNewLink = async () => {
    try {
        console.log('generateNewLink')
        const token = uuidv4();
        const response = await execute(`INSERT INTO users(token) VALUES('${token}')`);
        if (response.err) {
            console.log(response.err);
            return null;
        }
        return token;
    } catch (error) {
        console.log(error)
    }
    return null;
};

exports.deleteAll = async () => {
    try {
        console.log('deleteAll')
        let result = await execute(`DELETE FROM users`);
        if (result.err) throw result.err;
        return 'success'
    } catch (error) {
        console.log(error)
        throw error
    }
};

exports.timeConfirm = async (req, res) => {
    try {
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        if (ip === "::1") ip = "127.0.0.1";
        _timeConfirm(ip, res);
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

const _timeConfirm = async (IP, res) => {
    const ipQuery = `SELECT * FROM users WHERE ip = "${IP}"`;
    console.log('timeConfirm IP', IP);
    let result = await execute(ipQuery);
    if (result.err) throw result.err;
    if (result.length > 0) {
        console.log('check time')
        if (result[0].ip === IP) {
            getTimeNow(function (currentTime) {
                console.log(currentTime - result[0].time > 30)
                if ((Number(currentTime) - Number(result[0].time)) > 300) {//24 * 3600 = 1days  //
                    console.log('time expried')
                    res.send('expried')
                } else {
                    console.log(result[0].time + ' : ' + currentTime)
                    console.log('you can use the site yet')
                    res.send('available')
                }
            })
        } else {
            res.send('page-not-found')
        }
    } else {
        console.log('_timeConfirm -> page-not-found')
        res.send('page-not-found')
    }
}
