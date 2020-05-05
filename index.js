const express=require('express')
const fetch=require('node-fetch')

const app=express()

app.get('/question/top10',(req,res)=>{
    fetch('https://api.stackexchange.com/2.2/questions?page=1&pagesize=10&order=desc&sort=creation&site=stackoverflow')
    .then(resp=>resp.json())
    .then(response=>{
        res.send(response.items)
    })
})

app.get('/question/:id',(req,res)=>{
    let id=req.params.id
    fetch('https://api.stackexchange.com/2.2/questions/'+id+'?site=stackoverflow')
    .then(resp=>resp.json())
    .then(response=>{
        if(response.items.length>0){
            console.log('item')
        }
        else{
            console.log('no item')
        }
        res.send(response)
    })
})

app.listen(9000,()=>{
    console.log('server started')
})