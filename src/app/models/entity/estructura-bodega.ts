import {ServicioUnidadBodegas} from "../entity/servicio-unidad-bodegas"
import {ProductosBodegas} from "../entity/productos-bodegas"
import {UsuariosBodegas} from "../entity/usuarios-bodegas"
import { EstructuraRelacionBodega } from './estructura-relacion-bodega'


 
export class EstructuraBodega {
    accion       : string;
	hdgcodigo    : number;
	esacodigo    : number;
	cmecodigo    : number;
	codbodega    : number;
	desbodega    : string;
	estado       : string;
	modificable  : string;
	tipoproducto : string;
	tipobodega   : string;
	glosatipobodega : string;
	glosatiproducto : string;
	servidor        : string;
	serviciosunidadbodega : ServicioUnidadBodegas[];
	productosbodega  : ProductosBodegas[];
	usuariosbodega   : UsuariosBodegas[];
	relacionbodegas   : EstructuraRelacionBodega[];
}
