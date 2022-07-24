export class Principal {
    public id: number;
    public username: string;
    public email: string;
    public password: string;
    public token: string;

    constructor(id?: number, username?: string, email?: string, password?: string, token?: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.token = token;
    }
}
