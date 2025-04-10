require('dotenv').config()
const cors = require('cors')
const express = require('express')
const Person = require('./models/person')
const app = express()

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error:'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  } else if(error.name === 'DocumentNotFoundError'){
    return response.status(400).send({ error: `Information of${request.params.name} not found 
                        has already been deleted from the server.` })
  }
  next(error)
}

const time = require('express-timestamp')
const morgan = require('morgan')
app.use(cors())
app.use(express.json())
app.use(time.init)
app.use(express.static('dist'))
morgan.token('body', function getBody(request){
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-body] - :response-time ms :body'))

app.get('/',(request, response) => {
  response.send('<p>Hello</p>')
})
app.get('/api/persons',(request, response) => {
  Person.find({}).then((persons) => {
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
app.delete('/api/persons/:id',(request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id',(request, response, next) => {
  const id = request.params.id
  const body = request.body
  const filter = { _id:id }
  const options = {
    new: true,
    runValidators: true,
  }
  Person.findOneAndUpdate(filter,{ number: body.number }, options)
    .then(updatedPerson => {
      if(!updatedPerson){
        return response.status(404).end()
      }
      console.log(updatedPerson)
      response.json(updatedPerson)
    })
    .catch(error => {
      next(error)
    })
})

const unknownEndpoint = ((request, response) => {
  return response.status(404).send({
    error:'endpoint not found'
  })
})
app.use(unknownEndpoint)

app.use(errorHandler)

const PORT= process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})