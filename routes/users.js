var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var crypto = require('crypto');
var md5 = crypto.createHash("md5");


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'smms'
});

connection.connect();




/* GET users listing. */
router.get('/', function (req, res, next) {


  res.send('respond with a resource');
});

router.post('/add', function (req, res, next) {



  let { pass, username, region } = req.body;
  // let dataStr=`insert into userTables(name,pwd,usergroup)values('${username}','${pass}','${region}')`;
  let selectname = 'select count(u_id) from usertables where name=?'
  // 加密密码
  var str = md5.update(pass).digest('hex');

  let dataUser = [username]
  connection.query(selectname, dataUser, function (error, results, fields) {
    if (error) {
      throw error;
    }

    else if (results[0]["count(u_id)"] === 0) {
      let dataStr = 'insert into userTables(name,pwd,usergroup)values(?,?,?)';
let dataArr=[ username,str, region]

      connection.query(dataStr,dataArr ,function (error, results, fields) {
        if (error) throw error;
        res.send({ "ok": true, "msg": "添加成功" });
        // 加了是1
      });
    }
    else {
      // 没加是0
      res.send({ "ok": false, "msg": "用户名已存在" })
    }
  });


});

// 列表

router.get('/list', function (req, res, next) {
  let dataStr = "select * from userTables"
  connection.query(dataStr, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
    // 加了是1
  });

  ;
});

//删除
router.post('/del', function (req, res, next) {
  let { u_id } = req.body;

  let dataStr = `delete from userTables where u_id=${u_id}`

  connection.query(dataStr, function (error, results, fields) {
    if (error) throw error;
    res.send(results)
    // 加了是1
  });

  ;
});

//修改


// router.post('/revisionJump', function (req, res, next) {
//   name=req.body;
//   console.log("舔砖")
//   res.send("ok")

// ;
// });
router.post('/revision', function (req, res, next) {
  let { u_id, pass, oldpass } = req.body;
  console.log(u_id, pass, oldpass)

  let dataStr = `select pwd from userTables where u_id=${u_id}`


  console.log(dataStr)
  connection.query(dataStr, function (error, results, fields) {
    if (error) {
      throw error
    }
    else if (results[0]["pwd"] === oldpass) {
      let newpass = `update userTables set pwd='${pass}' where u_id=${u_id}`
      connection.query(newpass, function (error, results, fields) {
        if (error) throw error;
        res.send({ "ok": true, message: "添加成功" })

      });

    }
    else {
      res.send({ "ok": false, message: "添加失败" })
    }


  });



  // res.send("11")
  // console.log(dataStr)
  //  console.log(a)
  // connection.query(dataStr, function (error, results, fields) {
  //   if (error) throw error;

  //   console.log(results)
  //   res.send(results)
  //   // 加了是1
  // });


});



module.exports = router;
