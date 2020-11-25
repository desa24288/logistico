export class BodegasControladas {
    public codbodegacontrol: number;
    private desbodegacontrol: string;

    constructor(codbodegacontrol: number, desbodegacontrol: string) {
        this.codbodegacontrol = codbodegacontrol;
        this.desbodegacontrol = desbodegacontrol;
    }

    public setCodbodegaperi(codbodegacontrol: number) {
        this.codbodegacontrol = codbodegacontrol;
    }
    public getCodbodegacontrol() {
        return this.codbodegacontrol;
    }

    public setDescripcion(desbodegacontrol: string) {
        this.desbodegacontrol = desbodegacontrol;
    }
    public getDesbodegacontrol() {
        return this.desbodegacontrol;
    }
}