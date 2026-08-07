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

## Disconnecting
Call `disconnect()` to close the connection to the camera. This will trigger the `close` event once the socket has actually closed.

```ts
camera.disconnect();
```

## Listening to events
After initializing the camera, you can subscribe to listen to the `message` and `close` events.

### `message`
`message` gets triggered whenever the camera broadcasts data, typically after something is changed on camera or a request is sent from your application. The data being sent from the camera is in the first (and only) parameter formatted as json. The type is defined under `type` and is one of:

`rcp_cur_list` - Uses the `Types.CurList` type, contains a list.

`rcp_cur_int` - Uses the `Types.CurInt` type. Contains a number.

`rcp_cur_str` - Uses the `Types.CurStr` type. Contains a string.

`rcp_cur_cdl` - Uses the `Types.CurCdl` type. Contains all the data pertaining to the current CDL state.

There are many more message types defined in `Types` (menus, notifications, focus boxes, clip lists, key actions, etc.) - see [src/types.ts](src/types.ts) for the full list, which mirrors RED's RCP2 API Protocol documentation.

### `close`
`close` gets triggered whenever the connection doesn't get a response from the camera for 10 seconds, or after `disconnect()` is called.


## Sending Commands
Commands are sent to both retrieve data from the camera, as well as to set values in the camera. All the RPC2 parameters are documented by RED and the PDF can be downloaded [here](https://www.red.com/download/rcp2-documentation).


### `send()`
#### Arguments
- `message: RCPMessage`

Send a generic message to the camera. All the typed helper methods below are thin wrappers around this - if a JSON Object doesn't have a dedicated method yet, you can always send it directly.

---

### Getting values

#### `get()`
##### Arguments
- `id: string`

Request a response from the camera of type `id`. You will be subscribed to any further changes of the value of `id`, so the camera will automatically send another response if the value changes. Response will either be a `rcp_cur_int` or `rcp_cur_str`, depending on the `id`.

#### `getList()`
##### Arguments
- `id: string`

Request a response from the camera of type `id`. You will be subscribed to any further changes of the value of `id`, so the camera will automatically send another response if the value changes. Response will be a `rcp_cur_list`.

#### `getDefault()`
##### Arguments
- `id: string`

Request the default value of parameter `id`. Response will be a `rcp_cur_default_int` or `rcp_cur_default_str`.

#### `getLabel()`
##### Arguments
- `id: string`

Request the display label of parameter `id`. Response will be a `rcp_label`.

#### `getStatus()`
##### Arguments
- `id: string`

Request the enabled/supported status of parameter `id`. Response will be a `rcp_cur_status`.

#### `getCustomList()`
##### Arguments
- `id: string`

Request the custom list configuration for parameter `id` (only applicable to parameters with `has_custom_list` set). Response will be a `rcp_cur_custom_list`.

#### `getParameterInfo()`
##### Arguments
- `id: string`

Request which JSON Objects are supported for parameter `id`, and whether `id` is valid for this camera. Response will be a `rcp_cur_parameter_info`.

#### `getParameters()`
Request the full list of parameters supported by the camera. Response will be a `rcp_cur_parameters`.

#### `getTypes()`
Request the full list of named constants used by the camera's parameters, so your application doesn't need to hard-code values. Response will be a `rcp_cur_types`. RED recommends sending this immediately after connecting.

#### `getClipList()`
##### Arguments
- `members?: string[]`

Request the list of clips on the camera's media. Pass `members` to limit which fields are returned per clip, or omit it to get every field. Response will be a `rcp_cur_clip_list`.

#### `getFocusBoxes()`
Request the position, status, and type of every focus box on the camera. Response will be a `rcp_cur_focus_boxes`.

#### `getImuData()`
Request continuous IMU (accelerometer/gyro) data from the camera. Triggers repeated `rcp_cur_imu_data2` responses.

#### `getMenu()`
##### Arguments
- `nodeId: number`

Request the contents of a menu branch node (use `0` for the root menu). Response will be a `rcp_menu`.

#### `getMenuStatus()`
##### Arguments
- `nodeId: number`

Request the enabled/supported status of a menu branch node. Response will be a `rcp_menu_status`.

#### `getKeyActionInfo()`
##### Arguments
- `action: number`

Request details about a key action. Response will be a `rcp_cur_key_action_info`.

---

### Setting values

#### `set()`
##### Arguments
- `id: string`
- `value?: number | string`
- `x?: number`
- `y?: number`
- `width?: number`
- `height?: number`
- `action?: number`
- `argument?: string`

Sets the `id` parameter to `value`. The rest of the parameters are only used for specific parameters (points, rects, key actions).

For parameters that need fields `set()` doesn't expose directly - CDL (`power`/`slope`/`offset`/`saturation`), aperture (`fstop`/`tstop`/`tstop_fraction`), or key action `flag`/`held` - use `send()` directly with a `Types.Set` object; those fields are fully typed there.

#### `setRelative()`
##### Arguments
- `id: string`
- `offset: number`

Adjusts parameter `id` by `offset` relative to its current value.

#### `setListRelative()`
##### Arguments
- `id: string`
- `offset: number`

Moves parameter `id` by `offset` steps relative to its current position in its list.

#### `setCustomList()`
##### Arguments
- `id: string`
- `data: {num?: number, str?: string}[]`

Replaces the custom list for parameter `id` with the given entries. Pass an empty array to reset to the default list.

#### `setFocusBox()`
##### Arguments
- `id: string`
- `options?: {active?: boolean, point?: {x: number, y: number}}`

Changes which focus box is active and/or moves a focus box to a new center point.

#### `subscribe()`
##### Arguments
- `id: string`
- `onOff: boolean`

Explicitly subscribes to (or unsubscribes from) updates for parameter `id`. Note: accessing a parameter via `get()`/`set()`/etc. implicitly subscribes to it already, so this is only needed if you want updates for a parameter you aren't otherwise reading or writing.

---

### Presets & Scenes

#### `createPreset()`
##### Arguments
- `name: string`
- `options?: {description?: string, ids?: string[], custom_lists?: string[], force_overwrite?: boolean}`

Creates a preset on the camera containing the given parameter values.

#### `createScene()`
##### Arguments
- `options?: {name?: string, description?: string, slot?: number, force_overwrite?: boolean}`

Creates a broadcast scene on the camera.

---

### Notifications

#### `getNotification()`
Requests the current notification (if any is showing) - useful right after connecting so you can display it immediately instead of waiting for it to be re-sent.

#### `respondToNotification()`
##### Arguments
- `id: string`
- `response: number`

Sends the user's response to a notification that has a response list (e.g. tapping "Format" or "Later").

#### `notificationTimeout()`
##### Arguments
- `id: string`

Tells the camera the notification's timeout has expired (or the user dismissed it) and it should be closed.

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
