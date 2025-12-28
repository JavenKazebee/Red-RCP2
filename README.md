# Red RCP2
Typescript library for communication with Red RCP2 cameras (Komodo, Komodo-X, V-Raptor)

## Initialization
Connect to a camera by creating a new instance of the camera object. 
```ts
let camera = await new Camera('<Application Name>','<Camera IP>');
```

Placing the initialization in a `try/catch` block will allow you to handle a failed connection.

```ts
try {
    let camera = await new Camera("My App", "10.10.10.100");
    console.log("Connection Successful!")
} catch(e: any) {
    console.log("Connection Failed :(");
}
```

## Listening to events
After initializing the camera, you can subscribe to listen to the `message` and `close` events.

### `message`
`message` gets triggered whenever the camera broadcasts data, typically after something is changed on camera or a request is sent from your application. The data being sent from the camera is in the first (and only) parameter formatted as json. The type is defined under `type` and is one of:

`rcp_cur_list` - Uses the `Types.CurList` type, contains a list.

`rcp_cur_int` - Uses the `Types.CurInt` type. Contains a number.

`rcp_cur_str` - Uses the `Types.CurStr` type. Contains a string.

`rcp_cur_cdl` - Uses the `Types.CurCDL` type. Contains all the data pertaining to the current CDL state.

### `close`
`close` gets triggered whenever the connection doesn't get a response from the camera for 10 seconds.


## Sending Commands
Commands are sent to both retrieve data from the camera, as well as to set values in the camera. All the RPC2 parameters are documented by RED and the PDF can be downloaded [here](https://www.red.com/download/rcp2-documentation).


### `send()`
#### Arguments
- `message: RCPMessage`

Send a generic message to the camera.

---

### `get()`
#### Arguments
- `id: string`

Request a response from the camera of type `id`. You will be subscribed to any further changes of the value of `id`, so the camera will automatically send another response if the value changes. Response will either be a `rcp_cur_int` or `rcp_cur_str`, depending on the `id`.

---

### `getList()`
#### Arguments
- `id: string`

Request a response from the camera of type `id`. You will be subscribed to any further changes of the value of `id`, so the camera will automatically send another response if the value changes. Response will be a `rcp_cur_list`.

---

### `set()`
#### Arguments
- `id: string`
- `value?: number | string`
- `x?: number`
- `y?: number`
- `width?: number`
- `height?: number`
- `action?: number`
- `argument?: string`

Sets the `id` parameter to `value`. The rest of the parameters are only used for specific parameters.


---

## Example
```ts
import { Camera } from "red-rcp2";

console.log("Connecting...");

// Await camera connection
let camera = await new Camera("testeroni", "192.168.1.100").connect();


console.log("Connected");
// Start listening to messages as soon as connected
camera.on('message', (data) => {
    console.log(data);
});

// Get info from the camera
camera.get("RECORD_FORMAT");
```