require('dotenv').config()
const cors = require('cors')
const express = require('express')
const Person = require('./models/person')
const app = express()
const time = require('express-timestamp')
const morgan = require('morgan')
const {json} = require("express");
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(time.init)
//app.use(getPostBody)
app.use(express.static('dist'))
morgan.token('body', function getBody(request){
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-body] - :response-time ms :body'))

let persons = []
/*
const generateId = () => {
    const randomId = Math.floor(Math.random()*300)
    return String(randomId)
}

 */

app.get('/',(request, response) =>{
    response.send(`<p>Hello</p>`)
})
app.get('/api/persons',(request, response)=>{
    Person.find({}).then((persons) =>{
        response.json(persons)
        console.log(json(persons))
    })
    //response.json(persons)
})
app.get('/api/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people. <br> 
    ${request.timestamp}`)
})
app.get('/api/persons/:id', (request, response) => {
    //const id = request.params.id
    Person.findById(request.params.id).then((person) => {
        response.json(person)
    })
    /*
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }

     */
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
    } else {
        const person = new Person({
            name: request.body.name,
            number: request.body.number,
        })
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }


    /*
    const person = {
        id: generateId(),
        name: request.body.name,
        number: String(request.body.number)
    }
    persons = persons.concat(person)
    response.json()

     */
})
/*
function getPostBody (request, response, next){
    const body = request.body
    next()
}

 */

const PORT= process.env.PORT
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
})