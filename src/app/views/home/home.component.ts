import { Component, OnInit } from '@angular/core';
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
  public modelopermisos: Permisosusuario = new Permisosusuario();
  
  constructor() {
    console.log(this.modelopermisos.permisos);
   }
 
  ngOnInit() {
 
    this.hdgcodigo = Number(sessionStorage.getItem('hdgcodigo').toString());
    this.esacodigo = Number(sessionStorage.getItem('esacodigo').toString());
    this.cmecodigo = Number(sessionStorage.getItem('cmecodigo').toString());
    


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
