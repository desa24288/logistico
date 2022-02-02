import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../servicios/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private usuarioService: LoginService
  ) { }

  /**
   * Mod.: guarda nuevo token
   * Author: miguel.lobos@sonda.com
   * F. Mod.: 19-02-2021
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.usuarioService.islogin()
      .then(value => {
        const uilogistico = {
          token: value.token
        };
        sessionStorage.setItem('uilogistico', JSON.stringify(uilogistico));
        return true;
      })
      .catch(err => {
        this.router.navigate(['expirada']);
        return false;
      });
  }
}
