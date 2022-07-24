export class ListItemEvent {
    public id: string;
    public navigate: boolean;

    constructor(id?: string, navigate?: boolean) {
        this.id = id;
        this.navigate = navigate;
    }
}
