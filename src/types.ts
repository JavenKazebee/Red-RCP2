export interface RCPMessage {
    type: string,
}

export interface CreatePreset extends RCPMessage {
    type: "rcp_create_preset",
    name: string,
    description: string,
    id: string[]
}

export interface Config extends RCPMessage {
    type: "rcp_config",
    lang: string,
    strings_decoded: number,
    json_minified: number,
    include_cacheable_flags: number,
    encoding_type: string,
    client: {
        name: string,
        version: string
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
    }
}

export interface CurClipList extends RCPMessage {
    type: "rcp_cur_clip_list",
    clip_list_status: number,
    clip_list: Clip[]
}

export interface Clip extends RCPMessage {
    index: number,
    clip_name: string,
    clip_date: string,
    clip_time: string,
    sensor_fps: number,
    edge_start_timecode: string,
    edge_end_timecode: string,
    tod_start_timecode: string,
    tod_end_timecode: string,
    has_r3d: number,
    has_qt: number,
    has_mxf: number,
    duration: string,
    record_mode: number,
    compression: string,
    compression_abbr: string,
    format: string,
    project_fps_num: number,
    project_fps: string,
    project_fps_abbr: string,
    iso: string,
    iso_abbr: string,
    kelvin: string,
    kelvin_abbr: string,
    tint: string,
    tint_abbr: string,
    num_frames: string,
    camera_mode: number
    sensor_fps_str: string,
    sensor_fps_str_abbr: string,
    drop_frame_display_mode: number,
    thumbnail_path: string,
    display_clip_name: string,
    timecode_display: string,
    can_playback: number
}

export interface CurDefaultInt extends RCPMessage {
    type: "rcp_cur_default_int",
    id: string,
    default_val: number
}

export interface CurHist extends RCPMessage {
    type: "rcp_cur_hist",
    id: string,
    red: number[],
    green: number[],
    blue: number[],
    luma: number[],
    num_cols: number,
    max_val_per_col: number,
    bottom_clip: number,
    top_clip: number,
    bottom_clip_r: number,
    top_clip_r: number,
    bottom_clip_g: number,
    top_clip_g: number,
    bottom_clip_b: number,
    top_clip_b: number,
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
        cacheable: number
    },
    target: {
        val: number,
        cacheable: number
    },
    edit_info: CurIntEditInfo
}

export interface CurUint extends RCPMessage {
    type: "rcp_cur_uint",
    id: string,
    cur: {
        val: number,
        cacheable: number
    },
    target: {
        val: number,
        cacheable: number
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
    cur: number,
    target: number
}

export interface CurKeyAction extends RCPMessage {
    type: "rcp_cur_key_action",
    id: string,
    action: number,
    argument: string
}

export interface CurList extends RCPMessage {
    type: "rcp_cur_list",
    id: string,
    send: string,
    min_val?: number,
    max_val?: number,
    list: {
        cur: number,
        data: {num?: number, str?: string}[],
    }
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
    ids: string[]
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
    allowed_characters: string
}

export interface Get extends RCPMessage {
    type: "rcp_get",
    id: string
}

export interface GetClipList extends RCPMessage {
    type: "rcp_get_clip_list",
    members?: string[]
}

export interface GetDefault extends RCPMessage {
    type: "rcp_get_default",
    id: string
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

export interface GetStatus extends RCPMessage {
    type: "rcp_get_status",
    id: string
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

export interface MenuItem extends RCPMessage {
    node_type: NodeType,
    title: string,
    node_id?: number,
    is_enabled?: number,
    is_supported?: number,
    id?: number,
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
    CREATE_PREST = 19
}

export interface MenuStatus extends RCPMessage {
    type: "rcp_menu_status",
    node_id: number,
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
    ClOSE = 2
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

export interface Set extends RCPMessage {
    type: "rcp_set",
    id: string,
    value?: number,
    x?: number,
    y?: number,
    width?: number,
    height?: number
    action?: number,
    argument?: string
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

