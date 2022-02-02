import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit} from '@angular/core';
import {VERSION} from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NavItem} from './nav-item';
import {NavService} from './nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  title = 'logistico-angular';
  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  version = VERSION;
  navItems: NavItem[] = [
    {
      displayName: 'Prueba 1',
      iconName: 'recent_actors',
      route: 'prueba1',
      children: [
        {
          displayName: 'Subprueba 1',
          iconName: 'group',
          route: 'prueba1/subprueba1',
          children: [
            {
              displayName: 'Subsubprueba 1',
              iconName: 'person',
              route: 'prueba1/subprueba1/creadispensaprueba'
            }]          
        },
        {
          displayName: 'Subprueba 2',
          iconName: 'star_rate',
          route: 'prueba1/busquedacuentas',
        }
      ],
      }
    ];

  constructor(private navService: NavService,
    private router: Router,
    private route: ActivatedRoute,) {
  }

  ngOnInit() {
    // this.route.paramMap.subscribe(param => {          
    //    this.router.navigate(['login']);
    // });
 }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
