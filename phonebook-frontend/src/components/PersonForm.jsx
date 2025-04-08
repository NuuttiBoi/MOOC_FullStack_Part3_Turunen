const PersonForm = (props) =>{
    return (
        <div>
            <form onSubmit={props.onSubmit}>
            <div>
                name: <input
                value={props.newName}
                onChange={props.setName}
                />
            </div>
            <div>
                number:<input
                value={props.newNumber}
                onChange={props.changeNumber}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
            </form>
        </div>
    )
}
export default PersonForm