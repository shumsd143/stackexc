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
            let body=response.items[0]
            if(body.accepted_answer_id){
                fetch('https://api.stackexchange.com/2.2/answers/23394294?site=stackoverflow')
                .then(resp=>resp.json())
                .then(answerres=>{
                    let response_body=answerres.items[0]
                    response_body.question_title=body.title
                    res.send(response_body)
                })
            }
            else{
                if(body.is_answered===true){
                    res.send('no accepted answer')
                }
                else{
                    res.status(404).send({'question':'not found','answer':'not found'})
                }
            }
        }
        else{
            res.status(404).send({'question':'not found','answer':'not found'})
        }
    })
})

app.listen(9000,()=>{
    console.log('server started')
})