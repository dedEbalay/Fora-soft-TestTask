import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { getRooms, setCurrentRoom, dropMessages } from "../../redux/actions";
import socket from "../../socket";
import { v4 } from 'uuid'

function Rooms( { username, getRooms, activeRooms, setCurrentRoom, dropMessages } ) {

    const history = useHistory();

    function enterRoom( ID, name ) { // При входе в комнату push на нужный url и emit на сокет ID - имя комнаты, name - имя пользователя
        setCurrentRoom( ID );
        socket.emit('Room: Enter', ( { roomID: ID, username: name } ))
        history.push(`${ID}`);
    }

    const [room, setRoom] = useState('');

    useEffect(() => {   // Подгрузка существующих комнат при первом входе
        axios.get('http://localhost:3001/rooms').then(res => getRooms(res.data)) 
    }, [getRooms]);

    useEffect(() => {  // Обработка создания или удаления комнат
        socket.on('Global: Set Room', rooms => {
            getRooms(rooms)
        })
    }, [getRooms])

    useEffect(() => {  // Обновление кеша сообщений при возврате из комнаты
        dropMessages()
    }, [dropMessages])


    async function onCreateRoom( ID, name ) { // Создание комнаты
        
        if (ID) {
            await axios.post('http://localhost:3001/rooms', {
                roomID: ID,
                username: name
            })
            socket.emit('Global: Set Room', ID)
            enterRoom(ID, name)   
        } else {

            return alert('Введите название комнаты')

        }

    };

    if ( activeRooms.length === 0 ) {
        return (
            <div className="container rooms-container">
                <h2 className="rooms-title">Здесь пока нет ни одной комнаты</h2>
                <div className="input-wrapper">
                    <input className="chat-input" placeholder="Название комнаты" onChange={(e) => setRoom(e.target.value)}/>
                    <button className="chat-button" onClick={() => onCreateRoom(room, username)}>Создать</button>
                </div>
            </div>
        )
    };
    
    return (
        <div className="container rooms-container">
            <div className="rooms-wrapper">
                { activeRooms.map(room => {
                    let newRoomID
                    if ( room.length > 25 ) {
                        newRoomID = room.slice(0,25) + '...'
                    } else {
                        newRoomID = room
                    }
                    return (
                        <div key={v4()} >
                            <button className="room-join-button w-100" onClick={() => enterRoom(room, username)} >{newRoomID}</button>
                            <hr></hr>
                        </div>
                    )
                })}
            </div>
            <div className="input-wrapper">
                <input className="chat-input" placeholder="Название комнаты" onChange={(e) => setRoom(e.target.value)}/>
                <button className="chat-button" onClick={() => onCreateRoom(room, username)}>Создать</button>
            </div>
        </div>
    )
}

const mapStateToProps = ( store ) => {
    return {
        username: store.username,
        activeRooms: store.activeRooms,
        chat: store.chat
    }
}

const mapDispatchToProps = {
    getRooms,
    setCurrentRoom,
    dropMessages
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);