export class BodegaDestino {
    private boddescodigo: number;
    private boddesdescripcion: string;

    constructor(boddescodigo: number, boddesdescripcion: string) {
        this.boddescodigo        = boddescodigo;
        this.boddesdescripcion   = boddesdescripcion;
    }

    public setIdbodegadestino(boddescodigo: number) {
        this.boddescodigo = boddescodigo;
    }
    public getIdbodegadestino() {
        return this.boddesdescripcion;
    }

    public setDescripcion(boddesdescripcion: string) {
        this.boddesdescripcion = boddesdescripcion;
    }
    public getDescripcion() {
        return this.boddesdescripcion;
    }
}