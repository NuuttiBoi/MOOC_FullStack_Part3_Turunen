const express = require('express')
const app = express()
const time = require('express-timestamp')
const {response, request} = require("express");
app.use(express.json())
app.use(express.text())
app.use(time.init)
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
    } else if(persons.filter(person => person.name.toLowerCase()=== body.name.toLowerCase())){
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
const PORT=3001
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
})