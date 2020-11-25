export class FormaFar {
    private idforma: number;
    private descriforma: string;

    constructor(idforma: number, descriforma: string) {
        this.idforma = idforma;
        this.descriforma = descriforma;
    }

    public setIdforma(idforma: number) {
        this.idforma= idforma;
    }
    public getIdforma() {
        return this.idforma;
    }

    public setDescriforma(descriforma: string) {
        this.descriforma= descriforma;
    }
    public getdescriForma() {
        return this.descriforma;
    }
}