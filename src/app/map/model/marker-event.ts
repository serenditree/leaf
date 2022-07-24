export class MarkerEvent {
    public id: string;
    public scroll: boolean;
    public navigate: boolean;

    constructor(id?: string, scroll?: boolean, navigate?: boolean) {
        this.id = id;
        this.scroll = scroll;
        this.navigate = navigate;
    }
}
