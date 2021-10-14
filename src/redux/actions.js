const setUsername = ( username ) => {
    return {
        type: 'SET_USERNAME',
        payload: username
    }
}

const getRooms = ( rooms ) => {
    return {
        type: 'GET_ROOMS', 
        payload: rooms
    }
}

const setCurrentRoom = ( roomID ) => {
    return {
        type: 'SET_CURRENT_ROOM',
        payload: roomID
    }
}

const setUsersInRoom = ( userInRoome ) => {
    return {
        type: 'SET_USERS_IN_ROOM',
        payload: userInRoome
    }
}

const setMessages = ( newMessage ) => {
    return {
        type: 'SET_MESSAGES',
        payload: newMessage
    }
}

const dropMessages = () => {
    return {
        type: 'DROP_MESSAGES'
    }
}

export {
    dropMessages,
    setUsername,
    getRooms,
    setCurrentRoom,
    setUsersInRoom,
    setMessages
}