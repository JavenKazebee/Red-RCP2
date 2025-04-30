import WebSocket from 'ws'
import { Config, Get, GetList, RCPMessage, Set } from './types';
import EventEmitter from 'eventemitter3';

export default class Camera extends EventEmitter {
    ws: WebSocket | null;
    name: string;
    ip: string;
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
            this.ws = new WebSocket(`ws://${this.ip}:9998`, {handshakeTimeout: 10000});

            // Websocket setup
            this.ws?.on('error', (error) => {
                console.error(error);
                reject(error.message);
            });
            
            this.ws?.on('open', () => {
                // Start heartbeat
                this.heartbeat();

                // Send rcp_config object
                const config: Config = {
                    type: "rcp_config",
                    lang: "en",
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

                // Wait to receive confirmation of rcp_config, then resolve promise
                this.ws?.once('message', (data) => {
                    resolve(this);
                });
            });

            this.ws?.on('message', (data) => {
                let json = JSON.parse(data.toString());

                this.heartbeatTimeout?.refresh(); // Refresh heartbeat when we receive a message
                this.emit('message', json);
            });

            this.ws?.on('close', (data) => {
                this.emit('close');
            });
        });
    }

    send(message: RCPMessage) {
        let str = JSON.stringify(message);
        this.ws?.send(str);
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

    set(id: string, value?: number, x?: number, y?: number, width?: number, height?: number, action?: number, argument?: string) {
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

    private heartbeat() {
        // Every 3 seconds, send a heartbeat
        const heartbeat = setInterval(() => {
            this.send({
                type: "rcp_get",
                id: "get_types"
            } as Get);
        }, 3000);

        // After 10 seconds of no response, close the connection
        this.heartbeatTimeout = setTimeout(() => {
            console.log("No heartbeat received, closing connection");
            this.ws?.terminate();
            clearInterval(heartbeat);
        }, 10000);
    }
}