import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NotFoundPAgeComponent } from './views/not-found-page/not-found-page.component';
import { HomeComponent} from './views/home/home.component'
import { MantencionarticulosComponent } from './views/mantencionarticulos/mantencionarticulos.component'
import { ReposicionArticulosComponent } from './views/reposicion-articulos/reposicion-articulos.component'
import { SolicitudesManualesComponent } from './views/solicitudes-manuales/solicitudes-manuales.component'
import { MovimientosComponent } from './views/movimientos/movimientos.component';
import { DespachosolicitudesComponent } from './views/despachosolicitudes/despachosolicitudes.component';
import { ListadopararealizarinventarioComponent } from './views/listadopararealizarinventario/listadopararealizarinventario.component';
import { GenerainventariosistemaComponent } from './views/generainventariosistema/generainventariosistema.component';
import { DevolucionsolicitudesComponent } from './views/devolucionsolicitudes/devolucionsolicitudes.component';
import { IngresoconteomanualComponent } from './views/ingresoconteomanual/ingresoconteomanual.component';
import { GeneraajusteinventarioComponent } from './views/generaajusteinventario/generaajusteinventario.component';
import { InformeexistenciasvalorizadasComponent } from './views/informeexistenciasvalorizadas/informeexistenciasvalorizadas.component';
import { DispensarsolicitudpacienteComponent } from './views/dispensarsolicitudpaciente/dispensarsolicitudpaciente.component';
import { SolicitudpacienteComponent } from './views/solicitudpaciente/solicitudpaciente.component';
import { DevolucionsolicitudespacientesComponent } from './views/devolucionsolicitudespacientes/devolucionsolicitudespacientes.component';
import { RecepcionsolicitudesComponent } from './views/recepcionsolicitudes/recepcionsolicitudes.component';
import { DevolucionpacientesComponent } from './views/devolucionpacientes/devolucionpacientes.component';
import { DespachoRecetasAmbulatoriaComponent } from './views/despacho-recetas-ambulatoria/despacho-recetas-ambulatoria.component';
import { RecepciondevolucionentrebodegasComponent } from './views/recepciondevolucionentrebodegas/recepciondevolucionentrebodegas.component';
import { ConsultakardexComponent } from './views/consultakardex/consultakardex.component';
import { AjustestockComponent } from './views/ajustestock/ajustestock.component';
import { AjustevaloresComponent } from './views/ajustevalores/ajustevalores.component';
import { InformeajustesvalorizadosComponent } from './views/informeajustesvalorizados/informeajustesvalorizados.component';
import { InformeajustesdepreciosComponent } from './views/informeajustesdeprecios/informeajustesdeprecios.component';
import { BodegasComponent } from './views/bodegas/bodegas.component';
import { PlantillassolicitudbodegaComponent } from './views/plantillassolicitudbodega/plantillassolicitudbodega.component';
import { FraccionamientoproductosComponent } from './views/fraccionamientoproductos/fraccionamientoproductos.component';
import { MonitorEjecutivoComponent } from './views/monitor-ejecutivo/monitor-ejecutivo.component';
import { VersionesComponent } from './views/versiones/versiones.component';
import { ControlStockMinimoComponent } from './views/control-stock-minimo/control-stock-minimo.component';
import { LibrocontroladoComponent } from './views/librocontrolado/librocontrolado.component';
import { ConsultalibrocontroladoComponent } from './views/consultalibrocontrolado/consultalibrocontrolado.component';
import { ConsultarecetaambulatoriaComponent } from './views/consultarecetaambulatoria/consultarecetaambulatoria.component';
import { SolicitudConsumoComponent } from './views/solicitud-consumo/solicitud-consumo.component';
import { PlantillaConsumoComponent } from './views/plantilla-consumo/plantilla-consumo.component';
import { AdministracionRolesComponent } from './views/administracion-roles/administracion-roles.component';
import { DespachocostoservicioComponent } from './views/despachocostoservicio/despachocostoservicio.component';
import { CreadispensasolicitudpacienteComponent } from './views/creadispensasolicitudpaciente/creadispensasolicitudpaciente.component';
import { CierrekardexComponent } from './views/cierrekardex/cierrekardex.component';
import { PanelIntegracionCargosComponent } from './views/panel-integracion-cargos/panel-integracion-cargos.component';
import { PanelIntegracionERPComponent } from './views/panel-integracion-erp/panel-integracion-erp.component';
import { DevolucionautopedidoComponent } from './views/devolucionautopedido/devolucionautopedido.component';
import { BusquedacuentasComponent } from './views/busquedacuentas/busquedacuentas.component';
import { AuthGuard } from './guards/auth.guard';
import { ReportesComponent } from './views/reportes/reportes.component';
import { SesionexpiradaComponent } from './login/sesionexpirada/sesionexpirada.component';
import { ConsultafraccionamientoComponent } from './views/consultafraccionamiento/consultafraccionamiento.component';
import { InflistaconteoinventarioComponent } from './views/inflistaconteoinventario/inflistaconteoinventario.component';
import { InfconsolidadopordevolucionesService } from './servicios/infconsolidadopordevoluciones.service';
import { InfconsolidadoxdevolucionesComponent } from './views/infconsolidadoxdevoluciones/infconsolidadoxdevoluciones.component';
import { InftendenciasComponent } from './views/inftendencias/inftendencias.component';
import { DevolucionfraccionamientoComponent } from './views/devolucionfraccionamiento/devolucionfraccionamiento.component';
import { GenerardevolucionpacienteComponent } from './views/generardevolucionpaciente/generardevolucionpaciente.component';
import { RecepciondevolucionpacienteComponent } from './views/recepciondevolucionpaciente/recepciondevolucionpaciente.component';
import { ConsumopacienteporbodegaComponent } from './views/consumopacienteporbodega/consumopacienteporbodega.component';
import { PlantillasprocedimientosComponent } from './views/plantillasprocedimientos/plantillasprocedimientos.component';
import { CreacionrecetasambulatoriasComponent } from './views/creacionrecetasambulatorias/creacionrecetasambulatorias.component';
import { ConsultalotesComponent } from './views/consultalotes/consultalotes.component';
import { Autopedido2Component } from './views/autopedido2/autopedido2.component';
import { ConsultasaldosporbodegasComponent } from './views/consultasaldosporbodegas/consultasaldosporbodegas.component';
import { CambiaenlaceRscComponent } from './views/cambiaenlace-rsc/cambiaenlace-rsc.component';
import { InfpedidoscongastoservicioComponent } from './views/infpedidoscongastoservicio/infpedidoscongastoservicio.component';
import { LiberarsolireceComponent } from './views/liberarsolirece/liberarsolirece.component';
// import { InfconsumoporbodegasComponent } from './views/infconsumoporbodegas/infconsumoporbodegas.component';

const mi_routas: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: 'home', component: HomeComponent },//<-sin valid token
  { path: 'PanelIntegracionERPComponent', component: PanelIntegracionERPComponent, canActivate: [AuthGuard] },
  { path: 'PanelIntegracionCargosComponent', component: PanelIntegracionCargosComponent, canActivate: [AuthGuard] },
  { path: 'rolesusuarios', component: AdministracionRolesComponent, canActivate: [AuthGuard] },
  { path: 'plantillasbodegas', component: PlantillassolicitudbodegaComponent, canActivate: [AuthGuard] },
  { path: 'plantillaconsumo', component: PlantillaConsumoComponent, canActivate: [AuthGuard] },
  { path: 'solicitudconsumo', component: SolicitudConsumoComponent, canActivate: [AuthGuard] },
  { path: 'controlstockminimo', component: ControlStockMinimoComponent, canActivate: [AuthGuard] },
  { path: 'controlstockminimo/:id_suministro/:id_tipoproducto/:id_solicita/:fechadesde/:fechahasta/:id_articulo/:desc_articulo', component: ControlStockMinimoComponent, canActivate: [AuthGuard] },
  { path: 'reposicionarticulos', component: ReposicionArticulosComponent, canActivate: [AuthGuard] },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [AuthGuard] },
  { path: 'creasolicitud', component: SolicitudesManualesComponent, canActivate: [AuthGuard] },
  { path: 'despachosolicitudes/:id_solicitud/:retorno_pagina/:id_suministro/:id_tipoproducto/:id_solicita/:fechadesde/:fechahasta/:id_articulo/:desc_articulo', component: DespachosolicitudesComponent, canActivate: [AuthGuard]},
  { path: 'despachosolicitudes/:id_solicitud/:retorno_pagina', component: DespachosolicitudesComponent, canActivate: [AuthGuard]},
  { path: 'despachosolicitudes', component: DespachosolicitudesComponent, canActivate: [AuthGuard]},
  { path: 'listadopararealizarinventarios', component: ListadopararealizarinventarioComponent, canActivate: [AuthGuard] },
  { path: 'generainventariosistema', component: GenerainventariosistemaComponent, canActivate: [AuthGuard] },
  { path: 'devolucionsolicitudes', component: DevolucionsolicitudesComponent, canActivate: [AuthGuard] },
  { path: 'ingresoconteomanual', component: IngresoconteomanualComponent, canActivate: [AuthGuard]},
  { path: 'generaajusteinventario', component: GeneraajusteinventarioComponent , canActivate: [AuthGuard]},
  { path: 'informeexistenciasvalorizado', component: InformeexistenciasvalorizadasComponent, canActivate: [AuthGuard]},
  { path: 'dispensarsolicitudespacientes/:id_solicitud', component: DispensarsolicitudpacienteComponent, canActivate: [AuthGuard]},
  { path: 'dispensarsolicitudespacientes', component: DispensarsolicitudpacienteComponent, canActivate: [AuthGuard]},
  { path: 'solicitudpaciente', component: SolicitudpacienteComponent, canActivate: [AuthGuard] },
  { path: 'devolucionsolicitudespacientes', component: DevolucionsolicitudespacientesComponent, canActivate: [AuthGuard] },
  { path: 'recepcionsolicitudes/:id_solicitud', component: RecepcionsolicitudesComponent, canActivate: [AuthGuard] },
  { path: 'recepcionsolicitudes', component: RecepcionsolicitudesComponent, canActivate: [AuthGuard] },
  { path: 'devolucionpacientes', component: DevolucionpacientesComponent, canActivate: [AuthGuard] },
  { path: 'despachorecetasambulatoria/:soliid/:id_reseta/:retorno_pagina', component: DespachoRecetasAmbulatoriaComponent, canActivate: [AuthGuard] },
  { path: 'despachorecetasambulatoria/:soliid/:ambito/:ambito/:retorno_pagina', component: DespachoRecetasAmbulatoriaComponent, canActivate: [AuthGuard] },
  { path: 'despachorecetasambulatoria', component: DespachoRecetasAmbulatoriaComponent, canActivate: [AuthGuard] },
  { path: 'recepciondevolucionbodegas',  component: RecepciondevolucionentrebodegasComponent, canActivate: [AuthGuard]},
  { path: 'consultadekardex', component: ConsultakardexComponent, canActivate: [AuthGuard]},
  { path: 'ajustestock', component: AjustestockComponent, canActivate: [AuthGuard] },
  { path: 'ajustevalores', component: AjustevaloresComponent, canActivate: [AuthGuard] },
  { path: 'informeajustevalorizados', component: InformeajustesvalorizadosComponent, canActivate: [AuthGuard] },
  { path: 'ajustedeprecios', component: InformeajustesdepreciosComponent, canActivate: [AuthGuard] },
  { path: 'fraccionamientoproductos',component: FraccionamientoproductosComponent, canActivate: [AuthGuard] },
  { path: 'versiones',component: VersionesComponent, canActivate: [AuthGuard]},
  { path: 'librocontrolado',component: LibrocontroladoComponent, canActivate: [AuthGuard]},
  { path: 'consultalibrocontrolado', component: ConsultalibrocontroladoComponent, canActivate: [AuthGuard]},
  { path: 'consultarecetasambulatoria', component: ConsultarecetaambulatoriaComponent, canActivate: [AuthGuard]},
  { path: 'despachocostoservicio', component: DespachocostoservicioComponent, canActivate: [AuthGuard]},
  { path: 'cierrekardex', component: CierrekardexComponent, canActivate: [AuthGuard]},
  { path: 'creadispensasolicitudpaciente', component: CreadispensasolicitudpacienteComponent, canActivate: [AuthGuard]},
  { path: 'devolucionautopedido', component: DevolucionautopedidoComponent, canActivate: [AuthGuard] },
  { path: 'busquedacuentas', component: BusquedacuentasComponent, canActivate: [AuthGuard] },
  { path: 'reimpresionsolicitudes', component: ReportesComponent},
  { path: 'reportes', component: ReportesComponent},
  { path: 'bodegas', component: BodegasComponent, canActivate: [AuthGuard] },
  { path: 'bodegas/:codigo', component: BodegasComponent, canActivate: [AuthGuard] },
  { path: 'monitorejecutivo',component: MonitorEjecutivoComponent, canActivate: [AuthGuard] },
  { path: 'mantencionarticulos', component: MantencionarticulosComponent, canActivate: [AuthGuard] },
  { path: 'mantencionarticulos/:codigo', component: MantencionarticulosComponent, canActivate: [AuthGuard] },
  { path: 'expirada', component: SesionexpiradaComponent },
  { path: 'consultafraccionamiento', component: ConsultafraccionamientoComponent, canActivate: [AuthGuard]},
  { path: 'informeconteolistainventario', component: InflistaconteoinventarioComponent, canActivate: [AuthGuard] },
  { path: 'informeconsolidadodevoluciones', component: InfconsolidadoxdevolucionesComponent, canActivate: [AuthGuard] },
  { path: 'inftendencias', component: InftendenciasComponent, canActivate: [AuthGuard] },
  { path: 'devolucionfraccionamiento', component: DevolucionfraccionamientoComponent, canActivate: [AuthGuard] },
  { path: 'generadevolucionpaciente', component: GenerardevolucionpacienteComponent, canActivate: [AuthGuard] },
  { path: 'recepciondevolucionpaciente',component: RecepciondevolucionpacienteComponent, canActivate: [AuthGuard] },
  { path: 'consumopacienteporbodega', component: ConsumopacienteporbodegaComponent, canActivate: [AuthGuard] },
  { path: 'plantillasprocedimientos', component: PlantillasprocedimientosComponent, canActivate: [AuthGuard] },
  { path: 'creacionrecetasambulatorias', component: CreacionrecetasambulatoriasComponent, canActivate: [AuthGuard] },
  { path: 'consultalotes', component: ConsultalotesComponent, canActivate: [AuthGuard] },
  { path: 'consultasaldosporbodegas', component: ConsultasaldosporbodegasComponent, canActivate: [AuthGuard]},
  { path: 'autopedido', component: Autopedido2Component, canActivate: [AuthGuard] },
  { path: 'cambiaenlacersc', component: CambiaenlaceRscComponent, canActivate: [AuthGuard] },
  { path: 'infpedidosgastoservicio', component: InfpedidoscongastoservicioComponent, canActivate: [AuthGuard]},
  { path: 'liberarsolirece', component: LiberarsolireceComponent, canActivate: [AuthGuard] },
  // { path: 'infconsumoporbodegas', component: InfconsumoporbodegasComponent, canActivate: [AuthGuard] },
  // **** Nuevo menu ****/
  { path: 'monitorejecutivo', component: MonitorEjecutivoComponent, canActivate: [AuthGuard] },
  { path: 'producto', children: [
    { path: 'mantencionarticulos', component: MantencionarticulosComponent, canActivate: [AuthGuard] }
  ]},
  { path: 'admbodegas', children: [
    { path: 'bodegas', component: BodegasComponent, canActivate: [AuthGuard] },
    // { path: 'plantillas/:in_tipo', component: PlantillassolicitudbodegaComponent, canActivate: [AuthGuard] },
    { path: 'plantillasprocedimientos', component: PlantillasprocedimientosComponent, canActivate: [AuthGuard] },
    { path: 'plantillasbodegas', component: PlantillassolicitudbodegaComponent, canActivate: [AuthGuard] },
    { path: 'mainfraccionamiento', children: [
      { path: 'fraccionamientoproductos', component: FraccionamientoproductosComponent, canActivate: [AuthGuard] },
      { path: 'consultafraccionamiento', component: ConsultafraccionamientoComponent, canActivate: [AuthGuard]},
      { path: 'devolucionfraccionamiento', component: DevolucionfraccionamientoComponent, canActivate: [AuthGuard] },
      ]
    },

    { path: 'mainlibrocontrolado', children: [
      { path: 'librocontrolado', component: LibrocontroladoComponent, canActivate: [AuthGuard]},
      { path: 'consultalibrocontrolado', component: ConsultalibrocontroladoComponent, canActivate: [AuthGuard]},
      ]
    },
    { path: 'mainkardex', children: [
      { path: 'cierrekardex', component: CierrekardexComponent, canActivate: [AuthGuard]},
      { path: 'consultadekardex', component: ConsultakardexComponent, canActivate: [AuthGuard]},
    ]
    },
    { path: 'ajustes', children: [
      { path: 'ajustestock', component: AjustestockComponent, canActivate: [AuthGuard] },
    ]
    },
  ]},
  { path: 'movbodegas', children: [
    { path: 'creasolicitud', component: SolicitudesManualesComponent, canActivate: [AuthGuard] },
    { path: 'reposicionarticulos', component: ReposicionArticulosComponent, canActivate: [AuthGuard] },
    { path: 'despachosolicitudes', component: DespachosolicitudesComponent, canActivate: [AuthGuard]},
    { path: 'recepcionsolicitudes', component: RecepcionsolicitudesComponent, canActivate: [AuthGuard] },
    { path: 'devolucionsolicitudes', component: DevolucionsolicitudesComponent, canActivate: [AuthGuard] },
    { path: 'recepciondevolucionbodegas',  component: RecepciondevolucionentrebodegasComponent, canActivate: [AuthGuard]},
    { path: 'controlstockminimo', component: ControlStockMinimoComponent, canActivate: [AuthGuard] },
    { path: 'recepciondevolucionpaciente',component: RecepciondevolucionpacienteComponent, canActivate: [AuthGuard] },
    { path: 'consultasaldosporbodegas', component: ConsultasaldosporbodegasComponent, canActivate: [AuthGuard]},
    { path: 'consultalotes', component: ConsultalotesComponent, canActivate: [AuthGuard] },
  ]},
  { path: 'movpacientes', children: [
    { path: 'solicitudpaciente', component: SolicitudpacienteComponent, canActivate: [AuthGuard] },
    { path: 'creadispensasolicitudpaciente', component: CreadispensasolicitudpacienteComponent, canActivate: [AuthGuard]},
    { path: 'dispensarsolicitudespacientes', component: DispensarsolicitudpacienteComponent, canActivate: [AuthGuard]},
    { path: 'generadevolucionpaciente', component: GenerardevolucionpacienteComponent, canActivate: [AuthGuard] },
    { path: 'devolucionpacientes', component: DevolucionpacientesComponent, canActivate: [AuthGuard] },
    { path: 'creacionrecetasambulatorias', component: CreacionrecetasambulatoriasComponent, canActivate: [AuthGuard] },
    { path: 'despachorecetasambulatoria', component: DespachoRecetasAmbulatoriaComponent, canActivate: [AuthGuard] },
    { path: 'consultarecetasambulatoria', component: ConsultarecetaambulatoriaComponent, canActivate: [AuthGuard]},
    { path: 'consumopacienteporbodega', component: ConsumopacienteporbodegaComponent, canActivate: [AuthGuard] },
  ]},
  { path: 'reportes', children: [
    { path: 'reimpresionreportes', component: ReportesComponent, canActivate: [AuthGuard] },
    { path: 'informeconteolistainventario', component: InflistaconteoinventarioComponent, canActivate: [AuthGuard] },
    { path: 'informeconsolidadodevoluciones', component: InfconsolidadoxdevolucionesComponent, canActivate: [AuthGuard] },
    { path: 'inftendencias', component: InftendenciasComponent, canActivate: [AuthGuard] },
    { path: 'infpedidosgastoservicio', component: InfpedidoscongastoservicioComponent, canActivate: [AuthGuard]},
    // { path: 'infconsumoporbodegas', component: InfconsumoporbodegasComponent, canActivate: [AuthGuard] },
  ]},
  { path: 'consumo', children: [
    { path: 'solicitudconsumo', component: SolicitudConsumoComponent, canActivate: [AuthGuard] },
    { path: 'plantillaconsumo', component: PlantillaConsumoComponent, canActivate: [AuthGuard] },
  ]},
  { path: 'autopedido', component: Autopedido2Component, canActivate: [AuthGuard] },
  // { path: 'despachocostoservicio', component: DespachocostoservicioComponent, canActivate: [AuthGuard]},
  { path: 'devolucionautopedido', component: DevolucionautopedidoComponent, canActivate: [AuthGuard] },
  { path: 'busquedacuentas', component: BusquedacuentasComponent, canActivate: [AuthGuard] },
  { path: 'rolesusuarios', component: AdministracionRolesComponent, canActivate: [AuthGuard] },
  { path: 'integracion', children: [
    { path: 'PanelIntegracionCargosComponent', component: PanelIntegracionCargosComponent, canActivate: [AuthGuard] },
    { path: 'PanelIntegracionERPComponent', component: PanelIntegracionERPComponent, canActivate: [AuthGuard] },
  ]},
  { path: 'cambiaenlacersc', component: CambiaenlaceRscComponent, canActivate: [AuthGuard] },
  { path: 'liberarsolirece', component: LiberarsolireceComponent, },
  { path: 'acercade', children: [
    { path: 'versiones', component: VersionesComponent, canActivate: [AuthGuard]},
  ]},
  // **** *****/
  { path: '**', component: NotFoundPAgeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(mi_routas)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
