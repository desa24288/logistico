import { Component, OnInit } from '@angular/core';
import { BrowserStack } from 'protractor/built/driverProviders';
import { environment } from 'src/environments/environment';
import { Permisosusuario } from '../../permisos/permisosusuario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public hdgcodigo:number;
  public esacodigo:number;
  public cmecodigo:number;
  public imagen : string;
  public modelopermisos: Permisosusuario = new Permisosusuario();
  
  constructor() {
    // console.log(this.modelopermisos.permisos);
   }
 
  ngOnInit() {
 
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    
    switch (environment.URLServiciosRest.ambiente) {
      case 'DESARROLLO':
        this.imagen = "barra_supOS_DESA.jpg";
        break;
      case 'TESTING':
        this.imagen = "barra_supOS_QA.jpg";
        break;
      case 'PRODUCCION':
        this.imagen = "barra_supOS_PROD.jpg";
        break;
    }

  }


  getHdgcodigo(event: any) {
    this.hdgcodigo = event.hdgcodigo;

  }
  getEsacodigo(event: any) {
    this.esacodigo = event.esacodigo;
  }

  getCmecodigo(event: any) {
    this.cmecodigo = event.cmecodigo;
  }
}
