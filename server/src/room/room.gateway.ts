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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  users: Map<string, string>;

  constructor() {
    this.users = new Map();
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`connect client: ${client.id}`);
  }
  handleDisconnect(client: any) {
    console.log(`disconnect client: ${client.id}`);
    this.server.emit('onLeaveRoom', this.users.get(client.id));
    this.users.delete(client.id);
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('chat')
  handleMessage(@MessageBody() payload: any): string {
    console.log(payload);

    this.server.emit('onMessage', payload);
    return payload;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() payload: { user: { userName: string } },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('onJoinRoom', payload.user.userName);
    console.log(`User ${payload.user.userName} with id: ${client.id} joined`);
    this.users.set(client.id, payload.user.userName);
  }

  @SubscribeMessage('loadRoom')
  handleLoadRoom(): string[] {
    return Array.from(this.users.values());
  }
}
