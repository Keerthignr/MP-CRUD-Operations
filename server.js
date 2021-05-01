const express=require('express')
const app=express()
const bodyParser =require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/student',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('student')
    app.listen(5000,()=>{
        console.log('Listening to port number 5000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    var mysort={RollNo:1}
    db.collection('studentTable').find().sort(mysort).toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})

app.post('/AddData',(req,res)=>{
    const newItem={
        "RollNo": req.body.RollNo,
       "Name":req.body.Name,
       "PhoneNo":req.body.PhoneNo,
       "Branch":req.body.Branch,
       "Section":req.body.Section
    }
    db.collection("studentTable").insertOne(newItem
    ,(err,result)=>{
        if(err) return res.send(err)
        console.log(req.body.RollNo+" Student added")
        res.redirect('/')
    })
})

app.post('/update',(req,res)=>{
    db.collection('studentTable').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].RollNo==req.body.RollNo){
                s=result[i].Name
                break
            }
        }
        db.collection('studentTable').findOneAndUpdate({RollNo:req.body.RollNo},{
            $set:{Name:parseInt(s)+parseInt(req.body.Name)}},
            (err,result)=>{
                if(err) return res.send(err)
                console.log(req.body.RollNo+ ' stock updated')
                res.redirect('/')
            })
    })
})

// app.post('/update',(req,res)=>{
//     db.collection('studentTable').find().toArray((err,result)=>{
//         if(err) return console.log(err)
//         for(var i=0;i<result.length;i++){
//             if(result[i].RollNo==req.body.RollNo){
//                 s=result[i].Name
//                 break
//             }
//         }
//         db.collection('studentTable').findOneAndUpdate({RollNo:req.body.RollNo},{
//             $set:{Name:parseInt(s)+parseInt(req.body.Name)}},
//             (err,result)=>{
//                 if(err) return res.send(err)
//                 console.log(req.body.RollNo+ ' stock updated')
//                 res.redirect('/')
//             })
//     })
// })

app.post('/delete',(req,res)=>{
    db.collection('studentTable').findOneAndDelete({RollNo:req.body.id},(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})