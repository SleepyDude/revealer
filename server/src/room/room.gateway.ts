import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type User = {
  username: string;
  roomNum: number;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // users: Map<string, User>;
  rooms: Map<number, Map<string, string>>;
  userRoom: Map<string, number>;

  @WebSocketServer() server: Server;

  constructor() {
    this.rooms = new Map();
    this.userRoom = new Map();
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    const roomNum = +client.handshake.query['roomNum'];
    const username = '' + client.handshake.query['username'];

    console.log(
      `connect client: ${client.id}, roomNum: ${roomNum}, username: ${username}`,
    );

    if (!this.rooms.has(roomNum)) this.rooms.set(roomNum, new Map());
    this.rooms.get(roomNum).set(client.id, username);
    this.userRoom.set(client.id, roomNum);

    this.server.emit(`onJoinRoom_${roomNum}`, username);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const roomNum = this.userRoom.get(client.id);
    const username = this.rooms.get(roomNum).get(client.id);

    console.log(`disconnect client: ${client.id} roomNum: ${roomNum}`);

    this.userRoom.delete(client.id);
    this.rooms.get(roomNum).delete(client.id);
    if (this.rooms.get(roomNum).size === 0) this.rooms.delete(roomNum);

    this.server.emit(`onLeaveRoom_${roomNum}`, username);
  }

  @SubscribeMessage('loadRoom')
  handleLoadRoom(@ConnectedSocket() client: Socket): string[] {
    const roomNum = this.userRoom.get(client.id);
    return Array.from(this.rooms.get(roomNum).values());
  }
}
