export class TipoAmbito {
    private ambitocodigo     : number;
    private ambitodescripcion: string;

    constructor(ambitocodigo: number, ambitodescripcion: string) {
        this.ambitocodigo = ambitocodigo;
        this.ambitodescripcion = ambitodescripcion;
    }

    public setIdAmbitocodigo(ambitocodigo: number) {
        this.ambitocodigo = ambitocodigo;
    }
    public getIdAmbitocodigo() {
        return this.ambitocodigo;
    }

    public setAmbitodescripcion(ambitodescripcion: string) {
        this.ambitodescripcion = ambitodescripcion;
    }
    public getambitodescripcion() {
        return this.ambitodescripcion;
    }
}