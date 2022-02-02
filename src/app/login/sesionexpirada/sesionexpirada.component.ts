import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sesionexpirada',
  templateUrl: './sesionexpirada.component.html',
  styleUrls: ['./sesionexpirada.component.css']
})
export class SesionexpiradaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
  }

}
