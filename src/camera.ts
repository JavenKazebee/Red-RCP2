import WebSocket from 'ws'
import {
    Config, CreatePreset, CreateScene, Get, GetClipList, GetCustomList, GetDefault,
    GetFocusBoxes, GetImuData, GetKeyActionInfo, GetLabel, GetList, GetMenu, GetMenuStatus,
    GetParameterInfo, GetParameters, GetStatus, GetTypes, NotificationGet, NotificationResponse,
    NotificationTimeout, RCPMessage, Set, SetCustomList, SetFocusBox, SetListRelative,
    SetRelative, Subscribe
} from './types';
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

    getDefault(id: string) {
        const message: GetDefault = { type: "rcp_get_default", id };
        this.send(message);
    }

    getLabel(id: string) {
        const message: GetLabel = { type: "rcp_get_label", id };
        this.send(message);
    }

    getStatus(id: string) {
        const message: GetStatus = { type: "rcp_get_status", id };
        this.send(message);
    }

    getClipList(members?: string[]) {
        const message: GetClipList = { type: "rcp_get_clip_list", members };
        this.send(message);
    }

    getCustomList(id: string) {
        const message: GetCustomList = { type: "rcp_get_custom_list", id };
        this.send(message);
    }

    getFocusBoxes() {
        const message: GetFocusBoxes = { type: "rcp_get_focus_boxes" };
        this.send(message);
    }

    getImuData() {
        const message: GetImuData = { type: "rcp_get_imu_data" };
        this.send(message);
    }

    getMenu(nodeId: number) {
        const message: GetMenu = { type: "rcp_get_menu", node_id: nodeId };
        this.send(message);
    }

    getMenuStatus(nodeId: number) {
        const message: GetMenuStatus = { type: "rcp_get_menu_status", node_id: nodeId };
        this.send(message);
    }

    getParameterInfo(id: string) {
        const message: GetParameterInfo = { type: "rcp_get_parameter_info", id };
        this.send(message);
    }

    getParameters() {
        const message: GetParameters = { type: "rcp_get_parameters" };
        this.send(message);
    }

    getKeyActionInfo(action: number) {
        const message: GetKeyActionInfo = { type: "rcp_get_key_action_info", action };
        this.send(message);
    }

    getTypes() {
        const message: GetTypes = { type: "rcp_get_types" };
        this.send(message);
    }

    subscribe(id: string, onOff: boolean) {
        const message: Subscribe = { type: "rcp_subscribe", id, on_off: onOff };
        this.send(message);
    }

    setRelative(id: string, offset: number) {
        const message: SetRelative = { type: "rcp_set_relative", id, offset };
        this.send(message);
    }

    setListRelative(id: string, offset: number) {
        const message: SetListRelative = { type: "rcp_set_list_relative", id, offset };
        this.send(message);
    }

    setCustomList(id: string, data: {num?: number, str?: string}[]) {
        const message: SetCustomList = { type: "rcp_set_custom_list", id, list: { data } };
        this.send(message);
    }

    setFocusBox(id: string, options: {active?: boolean, point?: {x: number, y: number}} = {}) {
        const message: SetFocusBox = { type: "rcp_set_focus_box", id, ...options };
        this.send(message);
    }

    createPreset(name: string, options: {description?: string, ids?: string[], custom_lists?: string[], force_overwrite?: boolean} = {}) {
        const message: CreatePreset = { type: "rcp_create_preset", name, ...options };
        this.send(message);
    }

    createScene(options: {name?: string, description?: string, slot?: number, force_overwrite?: boolean} = {}) {
        const message: CreateScene = { type: "rcp_create_scene", ...options };
        this.send(message);
    }

    getNotification() {
        const message: NotificationGet = { type: "rcp_notification_get" };
        this.send(message);
    }

    respondToNotification(id: string, response: number) {
        const message: NotificationResponse = { type: "rcp_notification_response", id, response };
        this.send(message);
    }

    notificationTimeout(id: string) {
        const message: NotificationTimeout = { type: "rcp_notification_timeout", id };
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
