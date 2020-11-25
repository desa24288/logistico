import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Permisosusuario } from '../../permisos/permisosusuario';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public modelopermisos: Permisosusuario = new Permisosusuario();
  //public usuario = environment.privilegios.usuario;
  public usuario = null;
  // arrpermisos: number[];
  // btnMovbodega: boolean = false;
//creadispensasolpac
  constructor(
    private router: Router,
  ) {
    this.usuario = sessionStorage.getItem('Usuario').toString();
   }

  ngOnInit() {
    document.getElementById('side-menu').style.display = 'block';
    console.log(this.usuario);
  }
  
  doSomething() { }

  LlamaPantallaPlantillas(in_tipo: string){
   console.log("Llamará  o irá a la pantalla de plantillas, le envio 1 para hacer diferencia, entre ambas pantillas",in_tipo)
    this.router.navigate(['plantillas',in_tipo]);
  }

 
}
