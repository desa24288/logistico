export class EstadoSolicitud {
    private estsolcodigo     : number;
    private estsoldescripcion: string;

    constructor(estsolcodigo : number,estsoldescripcion: string) {
        this.estsolcodigo  = estsolcodigo ;
        this.estsoldescripcion = estsoldescripcion;
    }

    public setIDestsolcodigo (estsolcodigo : number) {
        this.estsolcodigo  = estsolcodigo;
    }
    public getIdEstsolcodigo () {
        return this.estsolcodigo;
    }

    public setEstsoldescripcion(estsoldescripcion: string) {
        this.estsoldescripcion = estsoldescripcion;
    }
    public getEstsoldescripcion() {
        return this.estsoldescripcion;
    }
}