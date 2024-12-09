const express = require("express");
const session = require("express-session");
const app = express()
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const path = require('path');
const connectdb = require("./db/connectdb");
const nocache = require('nocache')

app.use(nocache())

// Session setup 
app.use(session({
  secret: 'mySecret', 
  resave: false,  
  saveUninitialized: true,  
  cookie: { maxAge:1000 * 60 * 60 * 24}
}));

//static assets
app.use(express.static('public'))

//setup view engine
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'hbs')


app.use(express.urlencoded({extended:true}))
app.use(express.json())

// user and admin login routes
app.use('/user',userRoutes);
app.use('/admin',adminRoutes)



// connecting to the database
connectdb()

//server
app.listen(1111, ()=>{
  console.log('Server is running on port 1111')
})