export class BodegasFraccionables {
    public codbodegaperi: number;
    public desbodegaperi: string;
    public bodcodigo: number;
    public boddescripcion: string;

    constructor(codbodegaperi: number, desbodegaperi: string) {
        this.codbodegaperi = codbodegaperi;
        this.desbodegaperi = desbodegaperi;
    }

    public setCodbodegaperi(codbodegaperi: number) {
        this.codbodegaperi = codbodegaperi;
    }
    public getCodbodegaperi() {
        return this.codbodegaperi;
    }

    public setDescripcion(desbodegaperi: string) {
        this.desbodegaperi = desbodegaperi;
    }
    public getDesbodegaperi() {
        return this.desbodegaperi;
    }
}