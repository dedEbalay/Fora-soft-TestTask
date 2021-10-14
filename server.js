const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

app.use(cors());
app.use(express.json()); 


const rooms = new Map();

app.get('/rooms', ( req, res ) => { // Запрос на все комнаты

    res.json(Array.from(rooms.keys()))

});

app.get('/rooms/:id', ( req, res ) => { // Запрос на пользоваетелей и сообщения внутри комнаты при первом входе
    
    try {

        const { id : roomID } = req.params;

        const users = Array.from(rooms.get(roomID).get('users').values());

        const messages = rooms.get(roomID).get('messages');

        const obj = {
            users: users,
            messages: messages,
            roomID: roomID
        }

        res.json(obj)

    } catch (e) {
        
        console.log(e)

    }
});

app.post('/rooms', ( req, res ) => { // Создание комнат

    try {

        const { roomID } = req.body;

        if ( !rooms.has(roomID) ) {
            rooms.set(roomID, new Map([
                ['users', new Map()],
                ['messages', []]
            ]
            ))

        }

        return res.json(Array.from(rooms.keys()))
        
    } catch (e) {

        res.json(e.status)

    };

});

io.on('connection', socket => {

    socket.on('Room: Enter', ( { roomID, username } ) => { // Вход пользователя в комнату, обновление "онлайн" участников у всех в комнате
        if ( !rooms.get(roomID) ) {
            
        } else {
            socket.join(roomID);
            rooms.get(roomID).get('users').set(socket.id, username);
            const users = Array.from(rooms.get(roomID).get('users').values());
            socket.to(roomID).emit('Room: Set Users', users);
        }
    });

    socket.on('Room: Set Messages', ( { text: message, name: username, id: roomID, formatDate } ) => { // Получение и отправка сообщений
        socket.join(roomID);
        const obj = {
            author: username,
            text: message,
            date: formatDate
        }
        rooms.get(roomID).get('messages').push(obj);
        socket.to(roomID).emit('Room: Set Messages', obj);
    });

    socket.on('Global: Set Room', ID => { // Обновление комнат у тех кто находится на странице выбора комнаты
        if ( rooms.get(ID) ) {
            io.emit('Global: Set Room', (Array.from(rooms.keys())))
        }
    });

    socket.on('Room: Leave', ( { roomID, username } ) => { // Обновление "онлайн" пользоватеелей при нажатии на кнопку выхода из комнаты
        socket.join(roomID)
        rooms.get(roomID).get('users').delete(socket.id)
        const users = Array.from(rooms.get(roomID).get('users').values())
        socket.to(roomID).emit('Room: Set Users', users)
        rooms.forEach((value, roomID) => {
            if ( Array.from(value.get('users').values()).length === 0 ) {
                rooms.delete(roomID)
                io.emit('Global: Set Room', (Array.from(rooms.keys())))
            } 
        })
    });


    socket.on('disconnect', () => {
        rooms.forEach((value, roomID) => { // Удаление пользователя из комнаты при disconnect
            if ( value.get('users').delete(socket.id) ) {
                const users = [...value.get('users').values()];
                socket.to(roomID).emit('Room: Set Users', users);
            }
        })     
        rooms.forEach((value, roomID) => { // Удаление комнаты когда число её участников достигает 0
            if ( Array.from(value.get('users').values()).length === 0 ) {
                rooms.delete(roomID)
                io.emit('Global: Set Room', (Array.from(rooms.keys())))
            } 
        })
    });


});

http.listen(3001, () => {
    console.log('Server started at 3001')
});