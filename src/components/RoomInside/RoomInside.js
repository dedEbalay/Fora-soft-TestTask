import { useEffect, useState } from "react";
import { connect } from "react-redux";
import socket from "../../socket";
import { setUsersInRoom, setMessages, setCurrentRoom } from '../../redux/actions';
import axios from "axios";
import { v4 } from 'uuid';
import { useHistory } from "react-router";

function RoomInside( { roomID, usersInRoom, setUsersInRoom, setMessages, chat, username, setCurrentRoom } ) {

    const [messageText, setMessageText] = useState('');

    const history = useHistory();

    const url = '' + history.location.pathname.slice(7);

    useEffect(() => {   // Обработка захода пользоваетеля через url
        socket.emit('Room: Enter', ( { roomID: url, username } ) )
        axios.get(`http://localhost:3001/rooms/${url}`)
            .then(res => {
                if ( res.data.users.indexOf(username) === -1 ) {
                    setUsersInRoom([...res.data.users, username])
                } else {
                    setUsersInRoom(res.data.users)
                }  
                setCurrentRoom(res.data.roomID);
                res.data.messages.map(item => setMessages(item));
            });
    }, [setCurrentRoom, setMessages, setUsersInRoom, url, username]);

    useEffect(() => {  // Обработка подключения и отключения пользователей
        socket.on('Room: Set Users', data => {
            setUsersInRoom(data)
        });
    }, [setUsersInRoom]);

    useEffect(() => { // Обработка отрисовки новых сообщений
        socket.on('Room: Set Messages', obj=> {
            setMessages(obj);
        })
    }, [setMessages])

    useEffect(() => { // Скролл в самый низ, когда приходит новое сообщение
        document.querySelector('.chat-area').scrollTo({
            top: 9999,
            behavior: "smooth"
        })
    }, [chat])

    function sendMessages(text, name, id) { // Обработка отправки сообщений, дата приводится к виду "Ч:М  ДД.ММ"

        const date = new Date();

        function format(item) {
            if (item < 10) {
                const newItem = '0' + item
                return newItem
            }
            return item
        }

        const formatDate = '' + format(date.getHours()) + ':' + format(date.getMinutes()) + '  ' + format(date.getDate()) + '.' + format((date.getMonth() + 1));

        socket.emit('Room: Set Messages', ({ text, name, id, formatDate }))
        const obj = {
            author: username,
            text: text,
            date: formatDate
        }
        setMessages(obj)
        setMessageText('')
    }

    function backToRooms( roomID, username ) { // Обработка функции возврата на страницу выбора комнат
        socket.emit('Room: Leave', { roomID, username })
        history.push('/rooms/')
    }

    let newRoomID; 

    if ( roomID.length > 25 ) { // Сокращение длинных названий комнат
        newRoomID = roomID.slice(0, 25) + '...'
    } else {
        newRoomID = roomID
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between chat-header">
                <button onClick={() => backToRooms(roomID, username)} className="back-button btn btn-primary">Вернуться к чатам</button>
                <h2>Комната: <b>{newRoomID}</b></h2>
                <h2>Подключен как: <b>{username}</b></h2>
            </div>
            <div className="container d-flex">
                <div className="d-flex flex-column user-list">
                    <hr></hr>
                    {usersInRoom.map(name => {
                        return (
                            <>
                                <div className="mb-1" key={name}>{name}</div>
                                <hr></hr>
                            </>
                        )
                    })}
                </div>
                <div className="chat-area container-lg">
                    {chat.map(message => {
                        if ( message.author === username ) {
                            return (
                                <div className="d-flex own-message chat-message-wrapper mb-1" key={v4()}>
                                    <div className="me-2">{message.date}</div>
                                    <div className="">От <b>{message.author}</b></div>
                                    <div className="w-100 chat-message own-chat-message">{message.text}</div>
                                </div>
                            )
                        }
                        return (
                            <div className="d-flex chat-message-wrapper mb-1" key={v4()}>
                                <div className="me-2">{message.date}</div>
                                <div className="me-3">От <b>{message.author}</b></div>
                                <div className="w-100 chat-message">{message.text}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-100 input-wrapper">
                <input className="chat-input" placeholder='Ваше сообщение' value={messageText} onChange={e => {
                setMessageText(e.target.value)
                }} />
                <button className="chat-button" onClick={() => sendMessages(messageText, username, roomID)}>Отправить</button>
            </div>
        </div>
    )
}

const mapStateToProps = (store) => {
    return {
        roomID: store.roomID,
        usersInRoom: store.usersInRoom,
        chat: store.chat,
        username: store.username
    }
}

const mapDispatchToProps = {
    setUsersInRoom,
    setMessages,
    setCurrentRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomInside);