import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './utils/token.service';
import { Login } from '../models/entity/Login';
import { Privilegios } from '../models/entity/Privilegios';
import { Observable } from 'rxjs';
import { DevuelveDatosUsuario } from '../models/entity/DevuelveDatosUsuario';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private urlusuario : string = this.cargaURLConexion().concat('/validausuario'); 
  private urlprivilegiousuario = this.cargaURLConexion().concat('/obtenerprivilegios');
  private obtenermantencion = this.cargaURLConexion().concat('/obtenermantencion');
  private urlvalidatoken = this.cargaURLValidate().concat('/validate');


  constructor(
    public _http: HttpClient,
    private tokenService: TokenService
  ) { }

  BuscaUsuario(usuario: string, clave: string, servidor: string): Observable<DevuelveDatosUsuario[]> {

    return this._http.post<DevuelveDatosUsuario[]>(this.urlusuario, {
      'usuario': usuario,
      'clave': clave,
      'servidor': servidor
    });
  }

  Obtieneprivilegios(idusuario: number, hdgcodigo: number, esacodigo: number, cmecodigo: number, usuario: string, servidor: string): Observable<Privilegios[]> {
    return this._http.post<Privilegios[]>(this.urlprivilegiousuario, {
      'idusuario': idusuario,
      'hdgcodigo': hdgcodigo,
      'esacodigo': esacodigo,
      'cmecodigo': cmecodigo,
      'usuario': usuario,
      'servidor': servidor
    });
  }


  /**
   * Mod.: se manda parametro nombre de usuario para recibir un nuevo token con tiempo reiniciado
   * segunda funcion decodifica token actual para obtener nomusuario
   * Author: miguel.lobos@sonda.com
   * F. Mod.: 19-02-2021
   */
  public islogin(): Promise<any> {
    let nomuser = null;
    const uilogistico = JSON.parse(sessionStorage.getItem('uilogistico'));
    if (uilogistico !== null) {
      const decodedoken = this.getDecodedAccessToken(uilogistico.token);
      nomuser = decodedoken.user.name;
    }
    // return this._http.get<any>(this.urlvalidatoken, this.tokenService.get()).toPromise();
    return this._http.post<any[]>(this.urlvalidatoken, {
      "name" : nomuser,
      "password": " ",
      "role": " "
    }, this.tokenService.get()).toPromise();
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (err) {
    }
  }

  GetMantencion(servidor: string): Observable<boolean> {

    return this._http.post<boolean>(this.obtenermantencion, { 
      'servidorbd': servidor
    });
  }

  cargaURLConexion(): string{
    var url : string;
    if(sessionStorage.getItem('enlace') != null){
      url = sessionStorage.getItem('enlace').toString();
    } else {      
      url = environment.URLServiciosRest.URLConexionPublica;
    }
    return url;
  }

  cargaURLValidate(): string{
    var url : string;
    if(sessionStorage.getItem('enlacetoken') != null){
      url = sessionStorage.getItem('enlacetoken').toString();
    } else {      
      url = environment.URLServiciosRest.URLValidatePublica;
    }
    return url;
  }



}
