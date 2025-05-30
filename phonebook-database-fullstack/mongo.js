const mongoose = require('mongoose')

if(process.argv.length < 3){
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://nuuttiturunen:
${password}@cluster0.szliy4a.mongodb.net/persons?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url).then(r => {
  console.log(r)
})

const personSchema = new mongoose.Schema({
  name:String,
  number:String
})


const Person = mongoose.model('Person', personSchema)

if(name && number){
  const person = new Person({
    name:name,
    number:number
  })
  person.save().then(() => {
    console.log(`${name} was added to the phonebook.`)
    mongoose.connection.close().then(() => {
      console.log('connection closed')
    })
  })
} else {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, ' ', person.number)
    })
    mongoose.connection.close().then(() => {
      console.log('connection closed')
    })
  })
}