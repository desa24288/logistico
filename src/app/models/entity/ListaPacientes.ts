export class ListaPacientes {
  constructor(
    public tipoidentificacion?: number,
    public docuidentificacion?: string,
    public paterno           ?: string,
    public materno           ?: string,
    public nombres           ?: string,
    public sexo              ?: string,
    public fechahospitaliza  ?: string,
    public fechaalta         ?: string,
    public camaactual        ?: string,
    public estadohospitaliza ?: string,
    public codpaisnacimiento ?: number,
    public direccion         ?: string,
    public comuna            ?: string,
    public fonofijo          ?: string,
    public fonomovil         ?: string,
    public cliid             ?: number,
    public descidentificacion?: string,
    public fechanacimiento   ?: string,
    public edad              ?: string,
    public codsexo           ?: number,
    public undglosa          ?: string,
    public ctaid             ?: number,
    public estid             ?: number
  ) { }
}