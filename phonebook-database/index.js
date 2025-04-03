require('dotenv').config()
const cors = require('cors')
const express = require('express')
const Person = require('./models/person')
const app = express()

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({error:'malformatted id'})
    }
    next(error)
}

const time = require('express-timestamp')
const morgan = require('morgan')
const {json} = require("express");
app.use(cors())
app.use(express.json())
app.use(time.init)
app.use(express.static('dist'))
morgan.token('body', function getBody(request){
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-body] - :response-time ms :body'))

let persons = []

app.get('/',(request, response) =>{
    response.send(`<p>Hello</p>`)
})
app.get('/api/persons',(request, response)=>{
    Person.find({}).then((persons) =>{
        response.json(persons)
    })
})
app.get('/api/info', (request, response) => {
    Person.countDocuments()
        .then(result => {
            response.send((`Phonebook has info for ${result} people. <br> 
            ${request.timestamp}`))
        })
})
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if(person){
                response.json(person)
            } else {
                response.status(404).json({
                    error:'no person found'
                })
            }
})
        .catch(error => {
            next(error)
        })
})
app.delete('/api/persons/:id',(request,response) =>{
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {

        })
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
})

app.put('/api/persons/:id',(request, response, next) => {
    const id = request.params.id
    const body = request.body
    const filter = {_id:id}
    const options = {new: true}
    console.log(body.number)
    console.log(filter)
    Person.findOneAndUpdate(filter,{number: body.number}, options)
        .then(updatedPerson => {
            console.log(updatedPerson)
            if(updatedPerson){
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
        })
})

const unknownEndpoint = ((request, response) => {
    return response.status(404).send({
        error:'endpoint not found'
    })
})
app.use(unknownEndpoint)


app.use(errorHandler)

const PORT= process.env.PORT
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`)
})