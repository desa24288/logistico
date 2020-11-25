import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SolicitudConsumo } from '../models/entity/solicitud-consumo';
import { ProductoConsumo } from '../models/entity/producto-consumo';
import { ClinFarGrupoConsumo } from '../models/entity/clin-far-grupo-consumo';
import { ClinFarSubGrupoConsumo } from '../models/entity/clin-far-sub-grupo-consumo';
import { DetalleSolicitudConsumo } from '../models/entity/detalle-solicitud-consumo';
import { PlantillaConsumo } from '../models/entity/plantilla-consumo';
import { DetallePlantillaConsumo } from '../models/entity/detalle-plantilla-consumo';

@Injectable({
  providedIn: 'root'
})
export class SolicitudConsumoService {
  private url_grabarsolicitudconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/grabarsolicitudconsumo');
  private url_buscarsolicitudconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/buscarsolicitudconsumo');
  private url_buscarproductosconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/buscarproductosconsumo');
  private url_buscargrupoconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/buscargrupoconsumo');
  private url_buscarsubgrupoconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/buscarsubgrupoconsumo');
  private url_eliminardetallearticulosolicitudconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/eliminardetallearticulosolicitudconsumo');
  private url_eliminarsolicitudconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/eliminarsolicitudconsumo');

  private url_grabarplantillaconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/grabarplantillaconsumo');
  private url_buscarplantillaconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/buscarplantillaconsumo');
  private url_eliminardetallearticuloplantillaconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/eliminardetalleplantillaconsumo');
  private url_eliminarplantillaconsumo = environment.URLServiciosRest.URLConexionSolicitudConsumo.concat('/eliminarplantillaconsumo');

  constructor(public httpClient: HttpClient) { }


  eliminardetallearticuloplantillaconsumo(_DetallePlantillaConsumo:DetallePlantillaConsumo): Observable<any> {
    return this.httpClient.post(this.url_eliminardetallearticuloplantillaconsumo,_DetallePlantillaConsumo);
  }

  eliminarplantillaconsumo(_PlantillaConsumo:PlantillaConsumo): Observable<any> {
    return this.httpClient.post(this.url_eliminarplantillaconsumo,_PlantillaConsumo);
  }

  grabarplantillaconsumo(_PlantillaConsumo:PlantillaConsumo): Observable<any> {
    return this.httpClient.post(this.url_grabarplantillaconsumo,_PlantillaConsumo);
  }
  

  buscarplantillaconsumo(id: number, hdgcodigo : number, esacodigo: number,cmecodigo: number,centrocosto: number,idpresupuesto: number,operacioncontable: number,estado: number,usuario: string,servidor: string
    ):Observable<PlantillaConsumo[]>{
    return this.httpClient.post<PlantillaConsumo[]>(this.url_buscarplantillaconsumo, {   
      'id'                   : id, 
      'hdgcodigo'            : hdgcodigo, 
      'esacodigo'            : esacodigo,
      'cmecodigo'            : cmecodigo,
      'centrocosto'          : centrocosto,
      'idpresupuesto'        : idpresupuesto,
      'operacioncontable'    : operacioncontable,
      'estado'               : estado,
      'usuario'              : usuario,
      'servidor'             : servidor ,
        });
}



  eliminardetallearticulosolicitudconsumo(_DetalleSolicitudConsumo:DetalleSolicitudConsumo): Observable<any> {
    return this.httpClient.post(this.url_eliminardetallearticulosolicitudconsumo,_DetalleSolicitudConsumo);
  }

  eliminarsolicitudconsumo(_SolicitudConsumo:SolicitudConsumo): Observable<any> {
    return this.httpClient.post(this.url_eliminarsolicitudconsumo,_SolicitudConsumo);
  }

  grabarsolicitudconsumo(_SolicitudConsumo:SolicitudConsumo): Observable<any> {
    return this.httpClient.post(this.url_grabarsolicitudconsumo,_SolicitudConsumo);
  }
  

  buscarsolicitudconsumo(id: number, hdgcodigo : number, esacodigo: number,cmecodigo: number,centrocosto: number,idpresupuesto: number,
    referenciacontable: number,operacioncontable: number,estado: number, prioridad: number,usuariosolicita: string, 
    usuarioautoriza: string,usuario: string,servidor: string,fechadesde: string,fechahasta: string
    ):Observable<SolicitudConsumo[]>{
    return this.httpClient.post<SolicitudConsumo[]>(this.url_buscarsolicitudconsumo, {   
      'id'                   : id, 
      'hdgcodigo'            : hdgcodigo, 
      'esacodigo'            : esacodigo,
      'cmecodigo'            : cmecodigo,
      'centrocosto'          : centrocosto,
      'idpresupuesto'        : idpresupuesto,
      'referenciacontable'   : referenciacontable, 
      'operacioncontable'    : operacioncontable,
      'estado'               : estado,
      'prioridad'            : prioridad,
      'usuariosolicita'      : usuariosolicita,
      'usuarioautoriza'      : usuarioautoriza,
      'usuario'              : usuario,
      'servidor'             : servidor ,
      'fechadesde'           : fechadesde,  
      'fechahasta'           : fechahasta
        });
}

 

buscarproductosconsumo(	prodid :number,  hdgcodigo : number, esacodigo: number,cmecodigo: number,prodcodigo: string,proddescripcion:string,grupoid: number,
  subgrupoid:number, usuario:string, servidor:string
  ):Observable<ProductoConsumo[]>{
  return this.httpClient.post<ProductoConsumo[]>(this.url_buscarproductosconsumo, {
      
    prodid:prodid ,
	  hdgcodigo:hdgcodigo ,
	  esacodigo: esacodigo,
	  cmecodigo: cmecodigo,
	  prodcodigo: prodcodigo ,
	  proddescripcion:proddescripcion ,
	  grupoid:grupoid ,
	  subgrupoid: subgrupoid,
	  usuario: usuario ,
	  servidor: servidor,
      });
}


buscargrupoconsumo(	accion :string, grupoid:number,  hdgcodigo : number, esacodigo: number,cmecodigo: number,grupocodigo: string,grupodescripcion:string, usuario:string, servidor:string
  ):Observable<ClinFarGrupoConsumo[]>{
  return this.httpClient.post<ClinFarGrupoConsumo[]>(this.url_buscargrupoconsumo, {
    accion:accion,
    grupoid:grupoid ,
	  hdgcodigo:hdgcodigo ,
	  esacodigo: esacodigo,
	  cmecodigo: cmecodigo,
	  grupocodigo: grupocodigo ,
	  grupodescripcion:grupodescripcion ,
	  usuario: usuario ,
	  servidor: servidor,
      });
    }


    buscarsubgrupoconsumo(	accion :string, subgrupoid:number, grupoid:number,  hdgcodigo : number, esacodigo: number,cmecodigo: number,subgrupocodigo: string,subgrupodescripcion:string, usuario:string, servidor:string
        ):Observable<ClinFarSubGrupoConsumo[]>{
        return this.httpClient.post<ClinFarSubGrupoConsumo[]>(this.url_buscarsubgrupoconsumo, {
          accion:accion,
          subgrupoid:subgrupoid ,
          grupoid:grupoid ,
          hdgcodigo:hdgcodigo ,
          esacodigo: esacodigo,
          cmecodigo: cmecodigo,
          subgrupocodigo: subgrupocodigo ,
          subgrupodescripcion:subgrupodescripcion ,
          usuario: usuario ,
          servidor: servidor,
            });
      

}






}
