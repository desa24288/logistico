export class InventarioDetalle{
    constructor (
      
        public ajusteinvent   ?: number,
        public campo          ?: string,
        public codigomein     ?: string,
        public conteomanual   ?: number,
        public estadoajuste   ?: string,
        public fechacierre    ?: string,
        public iddetalleinven ?: number,        
        public idinventario   ?: number,
        public idmeinid       ?: number,
        public productodesc   ?: string,
        public stockinvent    ?: number,
        public valorcosto     ?: number,
        public servidor       ?: string,
        public usuario        ?: string,
        public tipomotivoajus ?: number
    ) {}
}