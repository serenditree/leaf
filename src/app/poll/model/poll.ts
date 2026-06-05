import {PollOption} from './poll-option';

export class Poll {
    public id: string;
    public owner: number;
    public seedId: string;
    public title: string;
    public options: PollOption[];

    constructor(id: string, owner: number, seedId: string, title: string, options: PollOption[]) {
        this.id = id;
        this.owner = owner;
        this.seedId = seedId;
        this.title = title;
        this.options = options;
    }
}
