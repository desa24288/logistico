export class Unidades {
    hdgcodigo: number;
    esacodigo: number;
    cmecodigo: number;
    unidadid: number;
    servicdescripcion: string;

    constructor(
        hdgcodigo?: number,
        esacodigo?: number,
        cmecodigo?: number,
        unidadid?: number,
        servicdescripcion?: string
    ) {
        this.hdgcodigo = hdgcodigo;
        this.esacodigo = esacodigo;
        this.cmecodigo = cmecodigo;
        this.unidadid = unidadid;
        this.servicdescripcion = servicdescripcion;
    }

}