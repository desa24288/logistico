export class EstadoRecetaProg {
    private cantentregas     : number;
    public diasentregadesc: string;

    constructor(cantentregas : number,diasentregadesc: string) {
        this.cantentregas  = cantentregas ;
        this.diasentregadesc = diasentregadesc;
    }

    public setIDCantentregas (cantentregas : number) {
        this.cantentregas  = cantentregas;
    }
    public getIdCantentregas () {
        return this.cantentregas;
    }

    public setDiasentregadesc(diasentregadesc: string) {
        this.diasentregadesc = diasentregadesc;
    }
    public getDiasentregadesc() {
        return this.diasentregadesc;
    }
}