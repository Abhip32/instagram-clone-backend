require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors')
const cookieParser = require('cookie-parser')
const SocketServer=require('./SocketServer')
const {ExpressPeerServer} = require('peer')

const app = express()
app.use(cors())
app.use(cookieParser())

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const http=require('http').createServer(app)
const io = require("socket.io")(http, {
    maxHttpBufferSize: 1e8, pingTimeout: 60000
});

const users=[]
io.on('connection', socket =>{
    SocketServer(socket)
})

ExpressPeerServer(http, { path: '/' })


//Routes
app.use('/api',require('./routes/authRouter'))
app.use('/api',require('./routes/userRouter'))
app.use('/api',require('./routes/postRouter'))
app.use('/api',require('./routes/commentRouter'))
app.use('/api',require('./routes/notifyRouter'))
app.use('/api',require('./routes/messageRouter'))

mongoose.set('strictQuery', false)
const URI=process.env.MONGODB_URL


mongoose.connect(URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},err=>{
    if(err) throw err
    console.log("Connected to MongoDB")
})



const port=process.env.PORT||5000


http.listen(port,()=>{
    console.log('Server is listening on port',port)
})