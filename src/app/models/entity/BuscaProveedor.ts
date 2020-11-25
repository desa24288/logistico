export class BuscaProveedor{
    constructor (
        public proveedorid      ?: number,
        public numerorutprov    ?: number, 
        public dvrutprov        ?: string,
        public descripcionprov  ?: string,
        public direccionprov    ?: string,
        public contactoprov     ?: string,
        public formapagos       ?: string,
        public montominfac      ?: number,
        public giro             ?: string,
        public telefono         ?: number,
        public telefono2        ?: number,
        public diremail         ?: string,
        public ciudadcod        ?: number,
        public ciudaddes        ?: string,
        public comunacod        ?: number,
        public comunades        ?: string,
        public formapago        ?: number,
        public formapagodes     ?: string        
    ) {}
}