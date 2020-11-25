import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { DispensaciondeOrden } from '../models/entity/DispensaciondeOrden';
import { environment } from '../../environments/environment';


@Injectable()
export class DispensaciondeordenService {
    public urlbuscasolicadispensar  : string = environment.URLServiciosRest.URLConexion.concat('/buscasolicitud');//"http://172.25.108.236:8191/buscasolicitud"; 
    public urlcierrasolicitud       : string = environment.URLServiciosRest.URLConexion.concat('/cerrarsolicitud');//"http://172.25.108.236:8191/cerrarsolicitud";
    public urldetallesolicitud      : string = environment.URLServiciosRest.URLConexion.concat('/buscasolicituddet');//"http://172.25.108.236:8191/buscasolicituddet";
    

    constructor(public _http: HttpClient) {

    }

    

    
}