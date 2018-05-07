const express = require("express");
var app = express();
const http = require('http');
var session = require('express-session');

const server = app.listen(1337);
const io = require('socket.io')(server);

app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
    secret: 'unicorns',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/stylesheet/style.css"));


var users = [];
var id = 0;


io.on('connection', function (socket) {
    var messages;
    var user;
    // emit users
    io.emit("user_data", {
        users: users,
        msgs: messages
        // emits to all new users the array of users
    });

    socket.on("new_user_added", function(data){
        id ++;
        user = {
            id: id,
            name: data.user
        };
        // creating a new user and pushing it to the users array
        users.push(user);
        console.log(user.name + " is signing on..");

        io.emit("new_user", {
            user: user,
            users: users
        });

    });
    socket.on("new_message", function(data){
        messages = {
            user: null,
            msg: []
        }
        var new_mes = data.msg;
        // console.log(data.msg);

        messages.user = user;
        messages.msg.push(new_mes);
        io.emit("new_mes", {
            msgs: messages
        });
    });
    // socket.on("leaving_user", function(data){
    //     var user = data.user;

    //     for (i in users){
    //         if (i == user){
    //             // users.delete(i);
    //             console.log("hi")
    //         }
    //     }
    // });

    socket.on("disconnect", function(data){
        for (var i =0; i< users.length; i++) {
            if (users[i] == user){
                users.splice(i, 1);
                console.log(user.name + " is signing off..");
            }
        }
        io.emit("user_data", {
            users: users
        });
        // console.log(e);
        

    });
});
// io.on("disconnection", function(socket){
    
// })

app.get('/', function (req, res) {
    res.render("main");
});
app.get('/main', function (req, res) {
    res.render("index");
});
app.get("/leave", function(req, res){
    res.render("main");
})