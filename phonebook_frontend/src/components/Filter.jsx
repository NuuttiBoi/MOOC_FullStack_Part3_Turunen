const Filter = (props) => {
    return (
        <div>
            filter shown with: <input
            placeholder='enter a name...'
            value={props.filter}
            onChange={props.onChange}
        />
        </div>
    )
}
export default Filter