var promise = require('bluebird');
const bcrypt = require('bcrypt');
var crypto = require('crypto');
RedisSessions = require("redis-sessions");
var db = require('../dbSetup/dbConfig');






rs = new RedisSessions();

rsapp = "nodejsassignment";


/////////////////////
// Query Functions
/////////////////////

function getUser(req, res, next) {
    //query for user friends and their friends list  select query...
    var query = "(select i.username,i2.username as friend_name from identity_user i join user_friends u on (i.id = u.user_id) join identity_user i2 on (u.friend_id = i2.id) where i.id ="+ req.params.id +") UNION (select i1.username,i2.username as friend_name from identity_user i1 join user_friends u1 on (i1.id = u1.user_id) join user_friends u2 on (u1.friend_id = u2.user_id) join identity_user i2 on (u2.friend_id = i2.id) where i1.id = "+ req.params.id +")" ;
    db.any(query)
        .then(function(data) {
            var response = JSON.parse(JSON.stringify(data));
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all friends'
                });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

function UserLogin(req, res, next) {
    var status;
    var query = "SELECT * FROM identity_user where username='" + req.body.username + "'";
    console.log(query)
    db.one(query)
        .then(function(data) {
            var response = JSON.parse(JSON.stringify(data));
            var sessiontoken;
            console.log('response', response.id);
            hash = response.password;
            if (bcrypt.compareSync(req.body.password, hash)) {
                status = 'authentication successfully';
                rs.create({
                        app: rsapp,
                        id: response.id,
                        ip: "192.168.22.58",
                        ttl: 3600,
                        d: {
                            foo: "bar",
                            unread_msgs: 34
                        }
                    },
                    function(err, resp) {
                        sessiontoken = resp.token
                        res.status(200)
                            .json({
                                message: status,
                                userId: response.id,
                                token: sessiontoken
                            });
                    });

            } else {
                status = 'authentication failed';
            }
        })
        .catch(function(err) {
            return next('authentication failed');
        });
}

function createUser(req, res, next) {
    // req.body.launched = parseInt(req.body.launched);
    var friend_id = req.body.friendIds;
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    db.query('INSERT INTO identity_user(username, password) values(${username}, ${password})  RETURNING id ', req.body)
        .then(data => {
            var response = JSON.parse(JSON.stringify(data[0]));
            friend_id.forEach(function(id) {
                db.query("INSERT INTO user_friends (user_id, friend_id) values('" + response.id + "', '" + id + "')");

            })
            res.send({
                message: 'registry success'
            });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}



/////////////
// Exports
/////////////

module.exports = {
    getUser: getUser,
    UserLogin: UserLogin,
    createUser: createUser
};