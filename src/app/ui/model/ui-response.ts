export class UiResponse {
    public code: number;
    public text: string;
    public data: any;

    constructor(code: number, text: string, data?: any) {
        this.code = code;
        this.text = text;
        this.data = data;
    }

    public ok(): boolean {
        return this.code && this.code === 200;
    }
}
