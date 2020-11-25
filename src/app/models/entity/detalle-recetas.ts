export class DetalleRecetas {
    constructor (
	public servidor         ?: string,
	public fechainicio      ?: string,
	public fechahasta       ?: string,
	public receid           ?: number,
	public redeid           ?: number,
	public hdgcodigo        ?: number,
	public esacodigo        ?: number,
	public cmecodigo        ?: number,
	public redemeincodmei   ?: string,
	public redemeindescri   ?: string,
	public rededosis        ?: number,
	public redeveces        ?: number,
	public redetiempo        ?: number,
    public redeglosaposologia ?: string,
	public redecantidadsolo   ?: number,
	public redecantidadadesp  ?: number,
	public meincontrolado	?: string,
	public meinid			?: number,
	public meintiporeg		?: string
        
    ) {}
}