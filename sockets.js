const rooms = []
const members =[]
const roomNames = []


function doesRoomExist(roomToCheck) {
  return members.some(item => item.room === roomToCheck);
}
function checkRoomExist(roomToCheck) {
  return rooms.some(item => item === roomToCheck);
}

function listen(io) {
  io.on('connection', (socket) => {
    let room;
    let roomName;
    console.log('a user connected', socket.id);

    socket.on('chat', (data) => {

     
    const name = data.name;
    console.log("Name: ", name)
      // Broadcast the chat message to all clients in the same room
      const room = members.find((m) => m.id == data.socketID).room;
      if (room) {
       socket.broadcast.to(room).emit('chat', {chat: data.chat, name: name});

      }
    });

    socket.on('join', (data) => {
      console.log("Data Join:", data);
      room = 0;

      if(data.room != ''){
        const y = roomNames.find((m) => m.room == data.room);
        roomName = y.roomName;
        room = (data.room);

        console.log(roomName)
      }
      else {
        console.log("first time join")
       
        while(rooms.includes(room.toString())){
          room = Math.floor(Math.random() * 10000);
          console.log("ROOMMMM: ",room)
        }
        room = room.toString();
        roomName = data.roomName;
        console.log(roomName)
        rooms.push(room);
        const x = {room: room, roomName: data.roomName}
        roomNames.push(x);
        console.log(rooms)
      }
      
      members.push({
        room: room,
        name: data.name,
        id: data.socketID
      })

      socket.join(room);
      console.log(`a user joined room ${room}`);
      const member0 = members.filter((m) => m.room == room);
      console.log("Members after joining room "+ room + " " +member0)
     
      io.to(room).emit('joined', { room: room, members:member0, roomName: roomName});
    });
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      const member = members.find((m) => m.id == socket.id);
      if (member) {
        const index = members.indexOf(member);
        members.splice(index, 1);
        console.log(members);
        const r = doesRoomExist(member.room);
        if (!r) {
          const index = rooms.indexOf(member.room);
          rooms.splice(index, 1);
        }
        console.log("Rooms:", rooms)
        console.log("Members:", members)
        io.to(member.room).emit('leave', { room: member.room, name: member.name  });
      }
    }
    );
  });
}

module.exports = {
  listen,
};
