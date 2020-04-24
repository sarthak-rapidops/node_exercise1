const express = require('express');
const morgan = require('morgan');
const router = require('./routes/user');
const app = express();

app.use(morgan('tiny'));
app.use('/',router)
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Server Up and running on port:"+port);
});