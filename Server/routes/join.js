var express = require('express');
var mysql = require('mysql');
var router =express.Router();
var connection = mysql.createConnection({
	'host' : '', 'user' : '', 'password' : '', 'database' : '',
});

router.post('/', function(req, res, next) {
        connection.query('insert into people(user_id,name,pw,phone) values (?,?,?,?);',
                [req.body.memberID, req.body.memberName,req.body.memberPwd,req.body.memberPhone],
						 function (error, info) {
                if (error == null){
                        connection.query('select * from board where id=?;',
                                        [info.insertId], function (error, cursor) {
                if (cursor.length > 0) {
                        res.json({
                                result : true, memberID : cursor[0].user_id, 
							memberName:cursor[0].name, memberPwd :cursor[0].pw, memberPhone:cursor[0].phone,
                        });
                }
                else
                        res.status(503).json({ result : false, reason : "Cannot join" });
                });
                }
         else
                res.status(503).json(error);
        });
});

module.exports = router;