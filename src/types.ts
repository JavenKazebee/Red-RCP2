export interface RCPMessage {
    type: string,
}

export interface CreatePreset extends RCPMessage {
    type: "rcp_create_preset",
    name: string,
    description?: string,
    ids?: string[],
    custom_lists?: string[],
    force_overwrite?: boolean
}

export interface CreateScene extends RCPMessage {
    type: "rcp_create_scene",
    name?: string,
    description?: string,
    slot?: number,
    force_overwrite?: boolean
}

export interface Config extends RCPMessage {
    type: "rcp_config",
    lang?: string, // only ever present on the camera's response; sending this is ignored by the camera
    strings_decoded: number,
    json_minified: number,
    include_cacheable_flags: number,
    encoding_type: string,
    client?: {
        name?: string,
        version?: string,
        version_num?: number[]
    }
}

export interface CurAudioVu extends RCPMessage {
    type: "rcp_cur_audio_vu",
    id: string,
    input_db: number[],
    input_state: number[],
    headphone: number[],
    show_audio_vu_meters: boolean
}

export interface CurCamInfo extends RCPMessage {
    type: "rcp_cur_cam_info",
    id: string,
    name: string,
    serial_number: string,
    camera_type: {
        str: string,
        num: number
    },
    version: {
        str: string,
        major: number,
        minor: number,
        patch: number,
        build: number,
        dev: number
    },
    supported_objects: string[]
}

export interface CurCdl extends RCPMessage {
    type: "rcp_cur_cdl",
    id: string,
    power: {
        r: number,
        g: number,
        b: number,
    },
    slope: {
        r: number,
        g: number,
        b: number,
    },
    offset: {
        r: number,
        g: number,
        b: number,
    }
    saturation: number
}

export interface CurClipList extends RCPMessage {
    type: "rcp_cur_clip_list",
    clip_list_status: number,
    clip_list: Clip[]
}

export interface Clip {
    index: number,
    clip_name: string,
    clip_date: string,
    clip_time: string,
    sensor_fps: number,
    sensor_fps_label: string,
    sensor_fps_str: string,
    sensor_fps_str_abbr: string,
    edge_start_timecode_label: string,
    edge_start_timecode: string,
    edge_end_timecode_label: string,
    edge_end_timecode: string,
    tod_start_timecode_label: string,
    tod_start_timecode: string,
    tod_end_timecode_label: string,
    tod_end_timecode: string,
    has_r3d: boolean,
    has_qt: boolean,
    has_mxf: boolean,
    duration_label: string,
    duration: string,
    record_mode: number,
    compression_label: string,
    compression: string,
    compression_abbr: string,
    format_label: string,
    format: string,
    project_fps_label: string,
    project_fps_num: number,
    project_fps: string,
    project_fps_abbr: string,
    iso_label: string,
    iso: string,
    iso_abbr: string,
    kelvin_label: string,
    kelvin: string,
    kelvin_abbr: string,
    tint_label: string,
    tint: string,
    tint_abbr: string,
    num_frames_label: string,
    num_frames: number,
    camera_mode: number,
    drop_frame_display_mode: number,
    thumbnail_path: string,
    display_clip_name_label: string,
    display_clip_name: string,
    timecode_display: number,
    can_playback: boolean,
    phantom_track: boolean,
    extended_highlights: boolean
}

export interface CurCustomList extends RCPMessage {
    type: "rcp_cur_custom_list",
    id: string,
    list: {
        cur: number,
        data: {num?: number, str?: string, selected: boolean}[],
    },
    min_val?: number,
    max_val?: number
}

export interface CurDefaultInt extends RCPMessage {
    type: "rcp_cur_default_int",
    id: string,
    default_val: number
}

export interface CurDefaultStr extends RCPMessage {
    type: "rcp_cur_default_str",
    id: string,
    default_val: string
}

export interface CurFocusBoxes extends RCPMessage {
    type: "rcp_cur_focus_boxes",
    boxes: FocusBox[]
}

export interface FocusBox {
    active: boolean,
    id: string,
    af_state_status: number,
    type: number,
    rect: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}

export interface CurImuData2 extends RCPMessage {
    type: "rcp_cur_imu_data2",
    ax: number,
    ay: number,
    az: number,
    gx: number,
    gy: number,
    gz: number,
    roll: number,
    pitch: number
}

export interface CurHist extends RCPMessage {
    type: "rcp_cur_hist",
    id: string,
    red: number[],
    green: number[],
    blue: number[],
    luma: number[],
    gio: number[],
    num_cols: number,
    num_gio_cols: number,
    max_val_per_col: number,
    bottom_clip: number,
    top_clip: number,
    bottom_clip_r: number,
    top_clip_r: number,
    bottom_clip_g: number,
    top_clip_g: number,
    bottom_clip_b: number,
    top_clip_b: number,
    num_types: number,
    types: number[],
    display: {
        str: string,
        abbr: string,
        status: string
    }
}

export interface CurInt extends RCPMessage {
    type: "rcp_cur_int",
    id: string,
    cur: {
        val: number,
        cacheable: boolean
    },
    target: {
        val: number,
        cacheable: boolean
    },
    edit_info: CurIntEditInfo
}

export interface CurUint extends RCPMessage {
    type: "rcp_cur_uint",
    id: string,
    cur: {
        val: number,
        cacheable: boolean
    },
    target: {
        val: number,
        cacheable: boolean
    },
    edit_info: CurUintEditInfo
}

export interface CurIntEditInfo extends RCPMessage {
    type: "rcp_cur_int_edit_info",
    id: string,
    min: number,
    max: number,
    divider: number,
    digits: number,
    step: number,
    prefix: string,
    suffix: string,
    hint: string,
    cur: number,
    target: number
}

export interface CurUintEditInfo extends RCPMessage {
    type: "rcp_cur_uint_edit_info",
    id: string,
    min: number,
    max: number,
    divider: number,
    digits: number,
    step: number,
    prefix: string,
    suffix: string,
    hint: string,
    cur: number,
    target: number
}

export interface CurKeyAction extends RCPMessage {
    type: "rcp_cur_key_action",
    id: string,
    action: number,
    argument: string,
    info: KeyActionInfo
}

export interface KeyActionInfo {
    style: number,
    is_enabled: boolean,
    trigger: number,
    is_on?: boolean
}

export interface CurKeyActionInfo extends RCPMessage {
    type: "rcp_cur_key_action_info",
    action: number,
    info: KeyActionInfo
}

export interface CurList extends RCPMessage {
    type: "rcp_cur_list",
    id: string,
    send: "int" | "uint" | "str" | null,
    min_val?: number,
    max_val?: number,
    list: {
        cur: number,
        data: {num?: number, str?: string, disabled?: boolean}[],
    },
    has_custom_list?: boolean
}

export interface CurParameterInfo extends RCPMessage {
    type: "rcp_cur_parameter_info",
    id: string,
    is_valid: boolean,
    supported_objects: string[]
}

export interface CurParameters extends RCPMessage {
    type: "rcp_cur_parameters",
    parameters: string[]
}

export interface CurPoint extends RCPMessage {
    type: "rcp_cur_point",
    id: string,
    x: number,
    y: number
}

export interface CurPresetOption extends RCPMessage {
    type: "rcp_cur_preset_option",
    id: string,
    option: number,
    ids: string[],
    custom_lists: string[]
}

export interface CurRect extends RCPMessage {
    type: "rcp_cur_rect",
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export interface CurStatus extends RCPMessage {
    type: "rcp_cur_status",
    id: string,
    is_enabled: number,
    is_supported: number,
}

export interface CurStr extends RCPMessage {
    type: "rcp_cur_str",
    id: string,
    cur?: {
        val?: string
    },
    display: {
        str: string,
        abbr: string,
        status: string
    },
    edit_info: CurStrEditInfo
}

export interface CurStrEditInfo extends RCPMessage {
    type: "rcp_cur_str_edit_info",
    id: string,
    min_len: number,
    max_len: number,
    is_password: boolean,
    show_qr_code: boolean,
    allowed_characters: string,
    regex: string,
    prefix: string,
    suffix: string,
    hint: string
}

export interface CurTypes extends RCPMessage {
    type: "rcp_cur_types",
    [typeName: string]: string | Record<string, number>
}

export interface Footer extends RCPMessage {
    type: "rcp_footer",
    sn: number,
    crc32: number
}

export interface Get extends RCPMessage {
    type: "rcp_get",
    id: string
}

export interface GetClipList extends RCPMessage {
    type: "rcp_get_clip_list",
    members?: string[]
}

export interface GetCustomList extends RCPMessage {
    type: "rcp_get_custom_list",
    id: string
}

export interface GetDefault extends RCPMessage {
    type: "rcp_get_default",
    id: string
}

export interface GetFocusBoxes extends RCPMessage {
    type: "rcp_get_focus_boxes"
}

export interface GetImuData extends RCPMessage {
    type: "rcp_get_imu_data"
}

export interface GetLabel extends RCPMessage {
    type: "rcp_get_label",
    id: string
}

export interface GetList extends RCPMessage {
    type: "rcp_get_list",
    id: string
}

export interface GetMenu extends RCPMessage {
    type: "rcp_get_menu",
    node_id: number
}

export interface GetMenuStatus extends RCPMessage {
    type: "rcp_get_menu_status",
    node_id: number
}

export interface GetParameterInfo extends RCPMessage {
    type: "rcp_get_parameter_info",
    id: string
}

export interface GetParameters extends RCPMessage {
    type: "rcp_get_parameters"
}

export interface GetStatus extends RCPMessage {
    type: "rcp_get_status",
    id: string
}

export interface GetKeyActionInfo extends RCPMessage {
    type: "rcp_get_key_action_info",
    action: number
}

export interface GetTypes extends RCPMessage {
    type: "rcp_get_types"
}

export interface Label extends RCPMessage {
    type: "rcp_label",
    label_full: string,
    label_abbr: string,
    label_components?: string[]
}

export interface Menu extends RCPMessage {
    type: "rcp_menu",
    node_id: number,
    children_list: MenuItem[]
    ancestor_list: MenuItem[]
}

export interface MenuItem {
    node_type: NodeType,
    title: string,
    node_id?: number,
    is_enabled?: number,
    is_supported?: number,
    id?: string,
    enable_value?: number,
    disable_value?: number
    action_label?: string,
    action_value?: number
}

export enum NodeType {
    BRANCH =  0,
    ACTION =  1,
    CURVE = 2,
    ENABLE = 3,
    IP_ADDRESS = 4,
    LIST = 5,
    NUMBER = 6,
    TEXT = 7,
    ORDERED_LIST = 8,
    DATETIME = 9,
    TIMECODE = 10,
    STATUS = 11,
    MULTI_ACTION_LIST = 12,
    NOT_YET_SUPPORTED = 13,
    CLIP_LIST = 14,
    NA = 15,
    NA2 = 16,
    DATE = 17,
    TIME = 18,
    CREATE_PRESET = 19
}

export interface MenuStatus extends RCPMessage {
    type: "rcp_menu_status",
    node_id: number,
    title: string,
    is_enabled: number,
    is_supported: number
}

export interface Notification extends RCPMessage {
    type: "rcp_notification",
    action: NotificationAction,
    id: string,
    title: string,
    message: string,
    progress_type: NotificationProgressType,
    progress_percent: number,
    response_list: {
        cur: number,
        data: {str: string, num: number}[],
    }
    timeout: number,
    notification_type: number
    notification_severity: NotificationSeverity,
    menu_nodes: MenuItem[]
}

export enum NotificationAction {
    OPEN = 0,
    UPDATE = 1,
    CLOSE = 2
}

export enum NotificationProgressType {
    NO_PROGRESS_BAR = 0,
    STANDARD = 1,
    INFINITE = 2
}

export enum NotificationSeverity {
    NORMAL = 0,
    WARNING = 1,
    ERROR = 2
}

export interface NotificationGet extends RCPMessage {
    type: "rcp_notification_get",
}

export interface NotificationResponse extends RCPMessage {
    type: "rcp_notification_response",
    id: string,
    response: number
}

export interface NotificationTimeout extends RCPMessage {
    type: "rcp_notification_timeout",
    id: string
}

export interface Session extends RCPMessage {
    type: "rcp_session",
    status: "open" | "closed",
    data?: string,
    reason?: string
}

export interface Set extends RCPMessage {
    type: "rcp_set",
    id: string,
    value?: number | string,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    action?: number,
    flag?: number,
    held?: boolean,
    argument?: string,
    power?: {
        r?: number,
        g?: number,
        b?: number
    },
    slope?: {
        r?: number,
        g?: number,
        b?: number
    },
    offset?: {
        r?: number,
        g?: number,
        b?: number
    },
    saturation?: number,
    fstop?: number,
    tstop?: number,
    tstop_fraction?: number
}

export interface SetCustomList extends RCPMessage {
    type: "rcp_set_custom_list",
    id: string,
    list: {
        data: {num?: number, str?: string}[]
    }
}

export interface SetFocusBox extends RCPMessage {
    type: "rcp_set_focus_box",
    id: string,
    active?: boolean,
    point?: {
        x: number,
        y: number
    }
}

export interface SetRelative extends RCPMessage {
    type: "rcp_set_relative",
    id: string,
    offset: number
}

export interface SetListRelative extends RCPMessage {
    type: "rcp_set_list_relative",
    id: string,
    offset: number
}

export interface Subscribe extends RCPMessage {
    type: "rcp_subscribe",
    id: string,
    on_off: boolean
}
