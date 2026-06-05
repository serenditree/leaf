export class Principal {
    public id: number;
    public username: string;
    public email: string | null;
    public password: string | null;
    public token: string | null;

    constructor(id: number = 0, username: string = '', email: string | null = null, password: string | null = null, token: string | null = null) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.token = token;
    }
}
