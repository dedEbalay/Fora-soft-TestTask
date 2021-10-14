import { connect } from "react-redux";
import { setUsername } from "../../redux/actions";
import { useHistory } from "react-router";
import { useState } from "react";

function EntryPage( { setUsername } ) {

    const history = useHistory();

    const [ name, setName ] = useState('');

    function onEnter() {
        if ( !name ) {
            return alert('Введите имя')
        }
        setUsername(name);
        localStorage.setItem('name', name)
        history.push('/rooms/');
    };

    return (
        <div className="entry-container container jusify-content-center h-100">
            <h2 className="enter-title">Введите ваше имя для доступа к чату</h2>
            <div className="input-wrapper">
                <input className="chat-input" placeholder='Username' value={name} onChange={ e => setName(e.target.value)}/>
                <button className="chat-button" onClick={onEnter}>Enter Chat</button>
            </div> 
        </div>
    );
}

const mapStateToProps = (store) => {
    return {
        
    }
}

const mapDispatchToProps = {
    setUsername
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryPage);