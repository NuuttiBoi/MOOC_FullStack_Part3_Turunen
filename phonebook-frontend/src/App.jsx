import {useEffect, useState} from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";
import personsService from "./services/persons";

const App = () => {
    const [persons, setPersons] = useState([])

    useEffect(() => {
        personsService.getAll().then(initialPersons => {
            setPersons(initialPersons)
            console.log('init', initialPersons)
        })
    }, [])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [notificationType, setNotificationType] = useState(null)
    const setName = (event)=>{
        setNewName(event.target.value)
    }
    const changeNumber = (event) =>{
        setNewNumber(event.target.value)
    }
    const changeFilter = (event) =>{
        setFilter(event.target.value)
        setShowAll(false)
        console.log(filter)
        console.log(persons.filter((person) =>
            person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())))
    }
    const personsToShow = showAll ? persons
        : persons.filter(person =>
            person.name.toLowerCase().includes(filter.toLowerCase()))

    const addPerson = (event) => {
        event.preventDefault()
        const personObject = {
            name: newName,
            number:newNumber
        }
        if(persons.some(person => person.name.toLowerCase() === newName.toLowerCase())){
            if(window.confirm(`${newName} is already added to the phonebook, replace old
            number with new one?`)){
                console.log('updating number')
                const personToUpdate = persons.find(person => person.name === newName)
                const updatedPerson = {
                    ...personToUpdate, number: newNumber
                }
                console.log('person to update', personToUpdate)
                personsService
                    .update(personToUpdate.id, updatedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id === personToUpdate.id ?
                        returnedPerson : person))
                        setNotificationType('add')
                        setNotificationMessage(`${personToUpdate.name}'s number has been updated.`)
                        setTimeout(() => {
                            setNotificationMessage(null)
                            setNotificationType(null)
                        },5000)
                        console.log('return data', returnedPerson.data)
                    })
                    .catch(error => {
                        if(error.response && error.response.data){
                            setNotificationType('remove')
                            setNotificationMessage(error.response.data.error)
                            setTimeout(() => {
                                setNotificationMessage(null)
                                setNotificationType(null)
                            }, 5000)
                        } else {
                            console.log(error)
                            console.log(`${personToUpdate.name} has been deleted from the server...`)
                            setNotificationType('remove')
                            setNotificationMessage(`Information of${personToUpdate.name} 
                        has already been deleted from the server.`)
                            console.log(error.response.data.error)
                            setTimeout(() => {
                                setNotificationType(null)
                                setNotificationMessage(null)
                            }, 5000)
                        }
                    })
            }
        } else{
            console.log('adding new person')
            personsService
                .create(personObject)
                .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                    setNotificationType('add')
                    setNotificationMessage(`${personObject.name} has been added to the list.`)
                    setTimeout(() => {
                        setNotificationMessage(null)
                        setNotificationType(null)
                    }, 5000)
                })
                .catch(error => {
                    console.log(error.response.data.error)
                    setNotificationType('remove')
                    setNotificationMessage(error.response.data.error)
                    setTimeout(() => {
                        setNotificationMessage(null)
                        setNotificationType(null)
                    }, 5000)
                })
        }
        setNewName('')
        setNewNumber('')
    }
    const deletePerson = (personID) => {
        personsService
            .getPerson(personID)
            .then(returnedPerson => {
                if(window.confirm(`are you sure you want to delete ${returnedPerson.name} from
            the phonebook?`)){
                    personsService
                        .remove(personID)
                        .then(response => {
                            console.log(response.data)
                        })
                        .then(() => {
                            setPersons(persons.filter((person) => person.id !== personID))
                            setNotificationType('remove')
                            setNotificationMessage(`${returnedPerson.name} has been removed
                            from the list.`)
                            setTimeout(() => {
                                setNotificationMessage(null)
                                setNotificationType(null)
                            },5000)
                        })
                        .catch(error => {
                            alert('an error occured while trying to delete', error)
                        })
                }
            })
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notificationMessage} type={notificationType}/>
            <Filter
                filter={filter}
                onChange={changeFilter}
            />
            <PersonForm
                onSubmit={addPerson}
                newName={newName}
                setName={setName}
                newNumber={newNumber}
                changeNumber={changeNumber}
            />
            <h2>Numbers</h2>
            <Persons
                personsToShow={personsToShow}
                onDelete={deletePerson}
            />
        </div>
    )
}

export default App