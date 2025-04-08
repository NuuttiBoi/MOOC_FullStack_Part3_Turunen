const Notification = (props) => {
    const styles= {
        add: {
            borderStyle:'solid',
            borderRadius:5,
            color:'green',
            fontSize:20
        },
        remove: {
            borderStyle:'solid',
            borderRadius:5,
            color:'red',
            fontSize:20
        }
    }
    return (
        <div style={styles[props.type]}>{props.message}</div>
    )
}
export default Notification