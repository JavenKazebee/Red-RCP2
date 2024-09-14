import WebSocket from 'ws'

export default class Camera {
    ws: WebSocket | null;
    name: string;
    ip: string;
    types: any;
    callback: ((data: any) => void);

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
                    resolve(this);
                });
            });

            this.ws?.on('message', (data) => {
                let json = JSON.parse(data.toString());
                
                if(json.type == "rcp_cur_types") {
                    this.types = json;
                }

                this.callback(json);
            });

            this.ws?.on('close', (data) => {
            });
        });
    }

    onMessage(callback: (data: any) => void) {
        this.callback = callback;
    }

    sendMessage(message: string) {
        this.ws?.send(message);
        console.log("Sent: " + message)
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
}