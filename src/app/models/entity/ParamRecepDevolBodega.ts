import { ParamDetRecepDevolBodega } from '../../models/entity/ParamDetRecepDevolBodega';

export class ParamRecepDevolBodega {
    constructor(
   
        public hdgcodigo           ?: number,
        public esacodigo           ?: number,
        public cmecodigo           ?: number,
        public servidor            ?: string,
        public usuariodespacha     ?: string,
        public soliid              ?: number,
        public paramdetdevolbodega ?: ParamDetRecepDevolBodega[],
    ) { }   
}