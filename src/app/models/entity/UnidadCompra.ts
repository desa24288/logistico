export class UnidadCompra {
    private idudecompra: number;
    private descripcion: string;

    constructor(idudecompra: number, descripcion: string) {
        this.idudecompra = idudecompra;
        this.descripcion = descripcion;
    }

    public setIdudecompra(idudecompra: number) {
        this.idudecompra = idudecompra;
    }
    public getIdudecompra() {
        return this.idudecompra;
    }

    public setDescripcion(descripcion: string) {
        this.descripcion = descripcion;
    }
    public getDescripcion() {
        return this.descripcion;
    }
}
