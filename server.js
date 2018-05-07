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
var messages = {
    user: null,
    msg:[]
}

io.on('connection', function (socket) {
    // emit users
    io.emit("user_data", {
        users: users
        // emits to all new users the array of users
    });
    socket.on("new_user_added", function(data){
        id ++;
        var user = {
            user_id: id,
            name: data.user
        };
        // creating a new user and pushing it to the users array
        users.push(user);

        socket.on("disconnect", function(){
            for (var i =0; i< users.length; i++) {
                if (users[i] == user){
                    users.splice(i, 1);
                }
            }
            console.log(user);
            io.emit("disconnect_user", {
                user: user
            });
            
        io.emit("new_user", {
            user: user,
            users: users
        });

        socket.emit("users_data_two", {
            users: users,
            user: user
        });
        
    });

        
        // console.log(data)/////////
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