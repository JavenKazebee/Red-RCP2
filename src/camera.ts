import WebSocket from 'ws'
import { Config, Get, GetList, RCPMessage, Set } from './types';
import EventEmitter from 'eventemitter3';

export default class Camera extends EventEmitter {
    ws: WebSocket | null;
    name: string;
    ip: string;
    heartbeatInterval: NodeJS.Timeout | null = null;
    heartbeatTimeout: NodeJS.Timeout | null = null;

    constructor(name: string, ip: string) {
        super();
        this.ws = null;
        this.name = name;
        this.ip = ip;
    }

    async connect(): Promise<Camera> {

        return new Promise((resolve, reject) => {
            // Connect to the camera
            const ws = new WebSocket(`ws://${this.ip}:9998`, {handshakeTimeout: 10000});
            this.ws = ws;

            let confirmed = false;
            const confirmTimeout = setTimeout(() => {
                reject(new Error('Timed out waiting for camera to confirm connection'));
                ws.terminate();
            }, 10000);

            // Websocket setup
            ws.on('error', (error) => {
                console.error(error);
                clearTimeout(confirmTimeout);
                reject(error.message);
            });

            ws.on('open', () => {
                // Start heartbeat
                this.heartbeat(ws);

                // Send rcp_config object
                const config: Config = {
                    type: "rcp_config",
                    strings_decoded: 1,
                    json_minified: 1,
                    include_cacheable_flags: 0,
                    encoding_type: "utf-8",
                    client: {
                        name: "red-rcp2",
                        version: "1.0"
                    }
                }
                this.send(config);
            });

            ws.on('message', (data) => {
                this.heartbeatTimeout?.refresh(); // Refresh heartbeat when we receive a message

                let json;
                try {
                    json = JSON.parse(data.toString());
                } catch (error) {
                    console.error('Received malformed message from camera:', error);
                    return;
                }

                this.emit('message', json);
                if (!confirmed && json.type === 'rcp_config') {
                    confirmed = true;
                    clearTimeout(confirmTimeout);
                    resolve(this);
                }
            });

            ws.on('close', () => {
                this.stopHeartbeat();
                this.ws = null;
                this.emit('close');
            });
        });
    }

    disconnect() {
        this.ws?.terminate();
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }

    send(message: RCPMessage) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('Cannot send message: camera is not connected');
        }

        let str = JSON.stringify(message);
        this.ws.send(str);
    }

    get(id: string) {
        let message: Get = {
            type: "rcp_get",
            id: id
        };

        this.send(message);
    }

    getList(id: string) {
        let message: GetList = {
            type: "rcp_get_list",
            id: id
        };

        this.send(message);
    }

    set(id: string, value?: number | string, x?: number, y?: number, width?: number, height?: number, action?: number, argument?: string) {
        const message: Set = {
            type: 'rcp_set',
            id,
            value,
            x,
            y,
            width,
            height,
            action,
            argument,
        };

        this.send(message);
    }

    private heartbeat(ws: WebSocket) {
        // Send a ping every 5 seconds
        this.heartbeatInterval = setInterval(() => {
            ws.ping();
        }, 5000);

        ws.on('pong', () => {
            this.heartbeatTimeout?.refresh();
        });

        // After 10 seconds of no response, close the connection
        this.heartbeatTimeout = setTimeout(() => {
            console.log("No heartbeat received, closing connection");
            ws.terminate();
        }, 10000);
    }
}
