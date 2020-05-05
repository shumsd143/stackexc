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
                fetch('https://api.stackexchange.com/2.2/answers/'+body.accepted_answer_id+'?site=stackoverflow')
                .then(resp=>resp.json())
                .then(answerres=>{
                    res.status(200).send({'question':response,'answer':answerres,'accepted_answer':true})
                })
            }
            else{
                if(body.is_answered===true){
                    fetch('https://api.stackexchange.com/2.2/questions/'+id+'/answers?order=desc&sort=votes&site=stackoverflow')
                    .then(resp=>resp.json())
                    .then(answerres=>{
                        res.status(200).send({'question':response,'answer':answerres,'accepted_answer':false})
                    })
                }
                else{
                    res.status(404).send({'question':response,'answer':'not found'})
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