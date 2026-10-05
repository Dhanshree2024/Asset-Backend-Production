import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private userSocketMap;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    registerUser(client: Socket, userId: number): void;
    emitToUser(userId: number, payload: any): void;
}
