import { io } from 'socket.io-client';

const options = {
    transports : ["websocket"]
};

const url = 'http://localhost:3001';

const socket = io(url, options);

export default socket;