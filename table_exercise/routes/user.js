const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false})


const dbURI = 'mongodb+srv://sarthak:sarthak@cluster0-xwzkd.mongodb.net/exercise?retryWrites=true&w=majority';
mongoose.connect(dbURI,{ useNewUrlParser: true,  useUnifiedTopology: true ,useFindAndModify:false});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

const schema = new mongoose.Schema({
    firstName:String,
    lastName:String
});

const TableData = mongoose.model('tabledata',schema);

router.get('/',(req,res)=>{
    TableData.find({},(err,data)=>{
        if(err) throw error;
        res.render('table',{tabled:data});
    });
});

router.post('/',urlencodedParser,(req,res)=>{
let newData = new TableData({firstName:req.body.fname,lastName:req.body.lname});
newData.save().then(response=>{
    console.log("Data inserted successfully!");
    TableData.find({},(err,data)=>{
        if(err) throw error;
        res.render('table',{tabled:data});
    });
})
.catch(err=>{
    console.log("ERROR: "+err);
    res.status(400).statusMessage("Failed to insert!");
});


});

router.post('/update',urlencodedParser,(req,res)=>{
TableData.updateOne({firstName:req.body.fnameOrig,lastName:req.body.lnameOrig},{firstName:req.body.fnameEdit,lastName:req.body.lnameEdit})
.then(response=>{
    console.log("Data Updated successfully!");
    TableData.find({},(err,data)=>{
        if(err) throw error;
        res.render('table',{tabled:data});
    });
})
.catch(err=>{
    console.log("ERROR: "+err);
    res.status(400).statusMessage("Failed to Update!");
});

})

router.post('/delete',urlencodedParser,(req,res)=>{
TableData.findOneAndDelete({firstName:req.body.fnameDel,lastName:req.body.lnameDel})
.then(response=>{
    TableData.find({},(err,data)=>{
        if(err) throw error;
        res.render('table',{tabled:data});
    });
})
.catch(err=>{
    console.log("ERROR: "+err);
    res.status(400).statusMessage("Failed to Delete!");
});
});
module.exports = router;
