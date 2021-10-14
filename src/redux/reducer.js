const initialState = {
    username: '',
    roomID: '',
    activeRooms: [],
    usersInRoom: [],
    chat: []
};

const reducer = (state = initialState, action) => {
    switch ( action.type ) {
        case 'SET_USERNAME':
            return {
                ...state,
                username: action.payload
            }
        case 'GET_ROOMS': 
            return {
                ...state,
                activeRooms: action.payload
            }
        case 'SET_CURRENT_ROOM':
            return {
                ...state,
                roomID: action.payload
            }
        case 'SET_USERS_IN_ROOM':
            return {
                ...state,
                usersInRoom: action.payload
            }
        case 'SET_MESSAGES':
            return {
                ...state,
                chat: [...state.chat, action.payload]
            }
        case 'DROP_MESSAGES':
            return {
                ...state,
                chat: []
            }
        default:
            return {
                ...state
            }
    }
}

export default reducer;