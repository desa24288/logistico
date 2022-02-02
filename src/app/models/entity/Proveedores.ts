export class Proveedores {
    constructor(

        public proveedorid      ?: number,
        public numerorutprov    ?: number,
        public dvrutprov        ?: string,
        public descripcionprov  ?: string,
        public direccionprov    ?: string,
        public contactoprov     ?: string,
        public formapago        ?: number,
        public montominfac      ?: number,
        public giro             ?: string,
        public ciudaddes        ?: string,
        public ciudadcod        ?: number,
        public ciudadcodigo     ?: number,
        public comunades        ?: string,
        public comunacod        ?: number,
        public comunacodigo     ?: number,
        public telefono         ?: number,
        public telefono2        ?: number,
        public diremail         ?: string,
        public observaciones    ?: string,
        public telefono1contac  ?: number,
        public telefono2contac  ?: number,
        public representante    ?: string,
        public direccionurl     ?: string,
        //public facturaelectr?: string,
        public facturaelectr    ?: number,
        public vigenciacod      ?: number
    ) { }
}