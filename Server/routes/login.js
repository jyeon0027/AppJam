var express = require('express');
var mysql = require('mysql');
var router =express.Router();
var connection = mysql.createConnection({
	'host' : '', 'user' : '', 'password' : '', 'database' : '',
});

router.post('/', function(req, res, next) {
        connection.query('insert into people(user_id,name,pw,phone) values (?,?,?,?);',
                [req.body.user_id, req.body.name,req.body.pw,req.body.phone],
						 function (error, info) {
                if (error == null){
                        connection.query('select * from board where id=?;',
                                        [info.insertId], function (error, cursor) {
                if (cursor.length > 0) {
                        res.json({
                                result : true, user_id : cursor[0].user_id, 
							name:cursor[0].name, pw :cursor[0].pw, phone:cursor[0].phone,
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

router.get('/', function(req, res, next) {  
	connection.query("select count(*) cnt from people where user_id=? and pw=?", 
					 	[req.body.memberID, req.body.memberPwd], function(error, cursor) {
  if(error==null) {
	  if (cursor[0].cnt == '0') {
		  res.status(503).json({ result : false, reason : "login-Fail" });

       } 
	  else { 
	   connection.query('select * from people where id=?;',
                  [req.body.memberID], function (error, cursor) {
		   				res.json({ result : true, cursor });

	   });
	  }
 }
 else
	 res.status(503).json(error);
	});
});

module.exports = router;