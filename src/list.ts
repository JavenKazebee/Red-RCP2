export default interface List {
    id: string;
    send: string;
    min_val: number;
    max_val: number;
    list: {
        cur: number;
        data: {num: number, str: string}[];
    }
}