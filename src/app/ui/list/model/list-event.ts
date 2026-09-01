export class ListEvent {
    public offset: number;
    public delta: number;

    constructor(offset: number, delta: number) {
        this.offset = offset;
        this.delta = delta;
    }
}
