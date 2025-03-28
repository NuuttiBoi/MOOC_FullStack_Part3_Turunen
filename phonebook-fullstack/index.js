const cors = require('cors')
const express = require('express')
const app = express()
const time = require('express-timestamp')
const morgan = require('morgan')
const {request} = require("express");
app.use(cors())
app.use(express.json())
app.use(time.init)
app.use(getPostBody)
app.use(express.static('dist'))
morgan.token('body', function getBody(request){
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-body] - :response-time ms :body'))
let persons =
[
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
const generateId = () => {
    const randomId = Math.floor(Math.random()*300)
    return String(randomId)
}

app.get('/',(request, response) =>{
    response.json()
    console.log(response.body, 'okk')
})
app.get('/api/persons',(request, response)=>{
    response.json(persons)
})
app.get('/api/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people. <br> 
    ${request.timestamp}`)
})
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})
app.delete('/api/persons/:id',(request,response) =>{
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(200).end()
})
app.post('/api/persons', (request, response) =>{
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'missing name and/or number'
        })
    } else if((persons.filter(person =>
        person.name.toLowerCase()=== body.name.toLowerCase())).length>0){
        return response.status(400).json({
            error: 'name already exists in the phonebook'
        })
    }
    const person = {
        id: generateId(),
        name: request.body.name,
        number: String(request.body.number)
    }
    persons = persons.concat(person)
    response.json()
})

function getPostBody (request, response, next){
    const body = request.body
    next()
}

const PORT= process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
})