export class Paciente {
    constructor(
        public cliid             ?: number,
        public descidentificacion?: string,
        public docuidentificacion?: string,
        public apepaternopac     ?: string,
        public apematernopac     ?: string,
        public nombrespac        ?: string,
        public sexo              ?: string,
        public fechanacimiento   ?: string,
        public unidadactual      ?: string,
        public camaapieza        ?: string,
        public camaactual        ?: string,
        public paternomedico     ?: string,
        public maternomedico     ?: string,
        public nombresmedico     ?: string,
        public numerocuenta      ?: number,
        public numeroestadia     ?: number,
        public tipoidentificacion?: number,
        public fechahospitaliza  ?: string,
        public fechaalta         ?: string,
        public estadohospitaliza ?: string,
        public codpaisnacimiento ?: string,
        public direccion         ?: string,
        public comuna            ?: string,
        public fonofijo          ?: string,
        public fonomovil         ?: string,
        public edad              ?: string,
        public cuentanumcuenta   ?: string,
        public undglosa          ?: string,
        public camglosa          ?: string,
        public pzagloza          ?: string,
        public glsexo            ?: string,
        public numdocpac         ?: string,
        public glstipidentificacion?: string,
        public numdocprof        ?: string,
        public nombremedico      ?: string,
        public codsexo           ?: number,
        public tipodocpac        ?: number,
        public codservicioactual ?: string,
        public ctaid             ?: number,
        public estid             ?: number,
        public codambito         ?: number,
        public rececodbodega     ?: number
    ) {
    }
}
