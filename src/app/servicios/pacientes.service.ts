import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ListaPacientes } from '../models/entity/ListaPacientes'
import { Paciente } from '../models/entity/Paciente';
import { Solicitudespacienteproducto } from '../models/entity/Solicitudespacienteproducto';
import { Recepciondevolucionpaciente } from '../models/entity/Recepciondevolucionpaciente';

@Injectable()

export class PacientesService {

  public pacientes_url: string = environment.URLServiciosRest.URLConexion.concat('/buscapaciente');//ambulatorio
  public pacientesambito_url: string = environment.URLServiciosRest.URLConexion.concat('/buscapacienteambito');//hospitalizado urgencia
  public solicitudesPacienteProducto_url: string = environment.URLServiciosRest.URLConexion.concat('/solicitudespacienteproducto');
  public devolucionpaciente_url: string = environment.URLServiciosRest.URLConexion.concat('/recepciondevolucionpaciente');

  constructor(public _http: HttpClient) { }

  BuscaListaPacientes(hdgcodigo: number, cmecodigo: number, tipodocumento: number,
    documentoid: string, paterno: string, materno: string, nombres: string,
    usuario: string, servidor: string)
    :Observable<ListaPacientes[]> { return this._http.post<ListaPacientes[]>(this.pacientes_url, {
  
      'hdgcodigo': hdgcodigo,
      'cmecodigo': cmecodigo,
      'tipodocumento': tipodocumento,
      'documentoid': documentoid,
      'paterno': paterno,
      'materno': materno,
      'nombres': nombres,
      'usuario': usuario,
      'servidor': servidor
    });
  }

  BuscaPacientes(hdgcodigo: number, cmecodigo: number, tipodocumento: number,
    documentoid: string, paterno: string, materno: string, nombres: string,
    usuario: string, servidor: string)

    :Observable<Paciente[]> { return this._http.post<Paciente[]>(this.pacientes_url, {
      'hdgcodigo': hdgcodigo,
      'cmecodigo': cmecodigo,
      'tipodocumento': tipodocumento,
      'documentoid': documentoid,
      'paterno': paterno,
      'materno': materno,
      'nombres': nombres,
      'usuario': usuario,
      'servidor': servidor
    });
  }

  BuscaPacientesAmbito(hdgcodigo: number, cmecodigo: number, esacodigo: number, paterno: string,
    materno: string, nombres: string, unidadid: number, piezaid: number, camid: number,
    servidor: string,serviciocod: string, ambito:number)
    :Observable<Paciente[]> { return this._http.post<Paciente[]>(this.pacientesambito_url, {
      'hdgcodigo': hdgcodigo,
      'cmecodigo': cmecodigo,
      'esacodigo': esacodigo,
      'paterno': paterno,
      'materno': materno,
      'nombres': nombres,
      'unidadid': unidadid,
      'piezaid': piezaid,
      'camid': camid,
      'servidor': servidor,
      'serviciocod': serviciocod,
      'ambito' : ambito
    });
  }

  BuscaSolicitudesPacienteProducto(hdgcodigo: number, esacodigo: number, cmecodigo: number,
    servidor: string, cliid: number, estid: number, codmei: string, soliid: number, lote: string,
    fechavto: string): Observable<Solicitudespacienteproducto[]> {
    return this._http.post<Solicitudespacienteproducto[]>(this.solicitudesPacienteProducto_url, {
        'hdgcodigo': hdgcodigo,
        'esacodigo': esacodigo,
        'cmecodigo': cmecodigo,
        'servidor': servidor,
        'cliid': cliid,
        'estid': estid,
        'codmei': codmei,
        'soliid': soliid,
        'lote': lote,
        'fechavto': fechavto
    });
  }

  Recepciondevolucionpaciente(recepciondevolucionpaciente: Recepciondevolucionpaciente): Observable<Recepciondevolucionpaciente> {
    return this._http.post(this.devolucionpaciente_url, recepciondevolucionpaciente);
  }



}




