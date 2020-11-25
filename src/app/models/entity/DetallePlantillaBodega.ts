export class DetallePlantillaBodega {
    constructor(
        public pldeid            ?: number,
        public planid            ?: number,
        public codmei            ?: string,
        public meindescri        ?: string,
        public meinid            ?: number,
        public cantsoli          ?: number,
        public pldevigente       ?: string,
        public fechacreacion     ?: string,
        public usuariocreacion   ?: string,
        public usuariomodifica   ?: string,
        public fechamodifica     ?: string,
        public usuarioelimina    ?: string,
        public fechaelimina      ?: string,
        public acciond           ?: string,
        public tiporegmein          ?: string
    ) { }
}