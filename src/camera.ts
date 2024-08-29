import WebSocket from 'ws'

export default class Camera {
    ws: WebSocket | null;
    name: string;
    ip: string;
    callback: ((data: string) => any);

    constructor(name: string, ip: string) {
        this.ws = null;
        this.name = name;
        this.ip = ip;
        this.callback = () => {};
    }

    async connect(): Promise<Camera> {
        // Connect to the camera
        this.ws = new WebSocket(`ws://${this.ip}:9998`);

        return new Promise((resolve, reject) => {
            // Websocket setup
            this.ws?.on('error', () => {
                console.error;
                reject();
            });
            
            this.ws?.on('open', () => {
                // Send rcp_config object
                this.sendConfig(this.name, "1.0", 1, 0);

                // Wait to receive confirmation of rcp_config, then resolve promise
                this.ws?.once('message', (data) => {
                    console.log("Config confirmed");
                    resolve(this);
                });
            });

            this.ws?.on('message', (data) => {
                this.callback(data.toString());
            });

            this.ws?.on('close', (data) => {
                console.log("Camera disconnected");
            });
        });
    }

    onMessage(callback: (data: string) => any) {
        this.callback = callback;
    }

    sendMessage(message: string) {
        this.ws?.send(message);
        console.log("Sent: " + message)
    }

    sendConfig(client_name: string, client_version: string, strings_decoded: number = 0, json_minified: number = 1) {
        this.sendMessage(`
        {
            "type":"rcp_config",
            "strings_decoded": 0,
            "json_minified": 0,
            "include_cacheable_flags": 0,
            "encoding_type": "legacy",
            "client":{
                "name": "My Awesome Control App",
                "version": "1.42"
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

    set(id: string, value: number) {
        this.sendMessage(`
            {
                "type": "rcp_set",
                "id": "${id}",
                "value": ${value}
            }
        `);
    }
}