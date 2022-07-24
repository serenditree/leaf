export class PollOption {
    public id: number;
    public text: string;
    public votes: number;

    constructor(text: string, votes: number) {
        this.text = text;
        this.votes = votes;
    }
}
