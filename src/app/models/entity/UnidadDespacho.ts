export class UnidadDespacho {
    private idudespacho: number;
    private descripcion: string;

    constructor(idudespacho: number, descripcion: string) {
        this.idudespacho = idudespacho;
        this.descripcion = descripcion;
    }

    public setIdudespacho(idudespacho: number) {
        this.idudespacho = idudespacho;
    }
    public getIdudespacho() {
        return this.idudespacho;
    }

    public setDescripcion(descripcion: string) {
        this.descripcion = descripcion;
    }
    public getDescripcion() {
        return this.descripcion;
    }
}
