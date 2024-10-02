import WebSocket from 'ws'

export default class Camera {
    ws: WebSocket | null;
    name: string;
    ip: string;
    types: any;
    messageCallback: ((data: any) => void);
    closeCallback: (() => void);
    heartbeatTimeout: NodeJS.Timeout | null = null;

    constructor(name: string, ip: string) {
        this.ws = null;
        this.name = name;
        this.ip = ip;
        this.messageCallback = () => {};
        this.closeCallback = () => {};
    }

    async connect(): Promise<Camera> {

        return new Promise((resolve, reject) => {
            // Connect to the camera
            this.ws = new WebSocket(`ws://${this.ip}:9998`, {handshakeTimeout: 1000});

            // Websocket setup
            this.ws?.on('error', (error) => {
                console.error(error);
                reject(error.message);
            });
            
            this.ws?.on('open', () => {
                // Start heartbeat
                this.heartbeat();

                // Send rcp_config object
                this.sendConfig(this.name, "1.0", 1, 0);

                // Wait to receive confirmation of rcp_config, then resolve promise
                this.ws?.once('message', (data) => {
                    resolve(this);
                });
            });

            this.ws?.on('message', (data) => {
                let json = JSON.parse(data.toString());
                
                if(json.type == "rcp_cur_types") {
                    this.types = json;
                }

                this.heartbeatTimeout?.refresh(); // Refresh heartbeat when we receive a message
                console.log("Message received, heartbeat refreshed");
                this.messageCallback(json);
            });

            this.ws?.on('close', (data) => {
                this.closeCallback();
            });
        });
    }

    onMessage(callback: (data: any) => void) {
        this.messageCallback = callback;
    }

    onClose(callback: () => void) {
        this.closeCallback = callback;
    }

    sendMessage(message: string) {
        this.ws?.send(message);
    }

    sendConfig(client_name: string, client_version: string, strings_decoded = 0, json_minified = 1, include_cacheable_flags = 0, encoding_type = "legacy") {
        this.sendMessage(`
        {
            "type":"rcp_config",
            "strings_decoded": ${strings_decoded},
            "json_minified": ${json_minified},
            "include_cacheable_flags": ${include_cacheable_flags},
            "encoding_type": "${encoding_type}",
            "client":{
                "name": "${client_name}",
                "version": "${client_version}"
            }
        }
        `);
    }

    getTypes() {
        this.sendMessage(`
            {
                "type": "rcp_get_types"
            }
        `);
    }

    get(id: string) {
        this.sendMessage(`
            {
                "type": "rcp_get",
                "id": "${id}"
            }
        `);
    }

    getList(id: string) {
        this.sendMessage(`
            {
                "type": "rcp_get_list",
                "id": "${id}"
            }
        `);
    }

    set(id: string, value: number) {
        this.sendMessage(`
            {
                "type": "rcp_set",
                "id": "${id}",
                "value": ${value}
            }
        `);
    }

    private heartbeat() {
        console.log("Heartbeat started");

        // Every 3 seconds, send a heartbeat
        const heartbeat = setInterval(() => {
            console.log("Sending heartbeat");
            this.getTypes();
        }, 3000);

        // After 5 seconds of no response, close the connection
        this.heartbeatTimeout = setTimeout(() => {
            console.log("No heartbeat received, closing connection");
            this.ws?.terminate();
            clearInterval(heartbeat);
        }, 5000);
    }
}