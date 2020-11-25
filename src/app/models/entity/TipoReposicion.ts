export class TipoReposicion {
    private codtiporeposicion     : number;
    private destiporeposicion   : string;

    constructor(codtiporeposicion: number, destiporeposicion: string) {
        this.codtiporeposicion = codtiporeposicion;
        this.destiporeposicion = destiporeposicion;
    }

    public setcodtiporeposicion(codtiporeposicion: number) {
        this.codtiporeposicion = codtiporeposicion;
    }
    public getcodtiporeposicion() {
        return this.codtiporeposicion;
    }

    public setdestiporeposicion(destiporeposicion: string) {
        this.destiporeposicion = destiporeposicion;
    }
    public getdestiporeposicion() {
        return this.destiporeposicion;
    }
}