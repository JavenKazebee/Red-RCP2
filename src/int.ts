export default interface Int {
    id: string;
    cur: {
        val: number,
        cacheable: boolean,
    }
    target: {
        val: number,
        cacheable: boolean,
    }
    edit_info: {
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
}