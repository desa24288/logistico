import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
//import { TokenService } from './utils/token.service';
import { Login } from '../models/entity/Login';
import { Privilegios } from '../models/entity/Privilegios';
import { Observable } from 'rxjs';
import { DevuelveDatosUsuario } from '../models/entity/DevuelveDatosUsuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private urlusuario = environment.URLServiciosRest.URLConexion.concat('/validausuario');
    private urlprivilegiousuario = environment.URLServiciosRest.URLConexion.concat('/obtenerprivilegios');

  constructor(
    public _http: HttpClient,
    //private tokenService: TokenService
  ) { }

  BuscaUsuario(usuario: string,clave:string,servidor:string):Observable<DevuelveDatosUsuario[]> {

    return this._http.post<DevuelveDatosUsuario[]>(this.urlusuario, {
        'usuario' : usuario,
        'clave'   : clave,
        'servidor': servidor 
    });
  }

  Obtieneprivilegios(idusuario:number,hdgcodigo:number, esacodigo:number, cmecodigo:number,usuario:string,servidor:string ):Observable<Privilegios[]> {
   return this._http.post<Privilegios[]>(this.urlprivilegiousuario, {
        'idusuario':idusuario,
        'hdgcodigo':hdgcodigo,
        'esacodigo':esacodigo,
        'cmecodigo':cmecodigo,
        'usuario' : usuario,
        'servidor': servidor
    });
  }
  
}
