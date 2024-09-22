export default interface Str {
    id: string;
    display: {
        str: string,
        abbr: string,
    }
    edit_info: {
        id: string,
        min_len: number,
        max_len: number,
        is_password: boolean,
        allowed_characters: string,
    }
}