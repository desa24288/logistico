import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MovimientoInterfaz } from '../models/entity/movimiento-interfaz';
import { DISPENSACIONRECETAS } from '../models/entity/dispensacion-recetas';
import { RespustaTransaccion } from '../models/entity/RespuestaTransaccion';



@Injectable()

export class InterfacesService {
  public urllistamoviminetointerfaz: string = environment.URLServiciosRest.URLInterfaces.concat('/listarmovimientointerfaz');
  public urlenviacargossisalud: string = environment.URLServiciosRest.URLInterfaces.concat('/enviacargossisalud');
  public urledispensacionRecetalegado: string = environment.URLServiciosRest.URLInterfaces.concat('/dispensacionRecetalegado');
  public urllistarmovimientointerfazbodegas: string = environment.URLServiciosRest.URLInterfaces.concat('/listarmovimientointerfazbodegas');
  
  
  constructor(public _http: HttpClient) {

  }


     listamovimientointerfaz(_movimientoInterfaz: MovimientoInterfaz): Observable<MovimientoInterfaz[]> {
    return this._http.post<MovimientoInterfaz[]>(this.urllistamoviminetointerfaz, _movimientoInterfaz)
   
     }

     listarmovimientointerfazbodegas(_movimientoInterfaz: MovimientoInterfaz): Observable<MovimientoInterfaz[]> {
      return this._http.post<MovimientoInterfaz[]>(this.urllistarmovimientointerfazbodegas, _movimientoInterfaz)
     
       }


     enviacargossisalud(_movimientoInterfaz: MovimientoInterfaz): Observable<MovimientoInterfaz[]> {
      return this._http.post<MovimientoInterfaz[]>(this.urlenviacargossisalud, _movimientoInterfaz)
     
       }
  
     dispensacionRecetalegado(_dispensaciponreceta: DISPENSACIONRECETAS): Observable<RespustaTransaccion> {
        return this._http.post<RespustaTransaccion>(this.urledispensacionRecetalegado, _dispensaciponreceta)
       
         }
    



  }



