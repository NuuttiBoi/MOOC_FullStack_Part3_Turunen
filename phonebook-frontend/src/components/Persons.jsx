
const Persons = (props) => {
    console.log('response...' , props.personsToShow)
    return (
        <div>
            <ul>
                {props.personsToShow.map(person => <li key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => props.onDelete(person.id)}>Delete</button>
                </li>)}
            </ul>
        </div>
    )
}
export default Persons