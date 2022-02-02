import { NavItem } from '../../nav-item';
export class Menu {
  navItems: NavItem[] = [
    /** menu Monitor */
    {
      displayName: 'Monitor',
      iconName: 'keyboard_arrow_right',
      route: 'monitorejecutivo'
    },
    /** menu Productos */
    {
      displayName: 'Productos',
      iconName: 'keyboard_arrow_right',
      route: 'producto',
      children: [
        {
          displayName: 'Mantención Artículos',
          iconName: 'keyboard_arrow_right',
          route: 'mantencionarticulos'
        }]
    },
    /** menu Adm.Bodegas */

    {
      displayName: 'Administración Bodegas',
      iconName: 'keyboard_arrow_right',
      route: 'admbodegas',
      children: [
        {
          displayName: 'Bodegas',
          iconName: 'keyboard_arrow_right',
          route: 'bodegas',
        },
        {
          displayName: 'Plantillas Bodegas',
          iconName: 'keyboard_arrow_right',
          route: 'plantillasbodegas',
        },
        {
          displayName: 'Plantillas Procedimientos',
          iconName: 'keyboard_arrow_right',
          route: 'plantillasprocedimientos',
        },

        {
          displayName: 'Fraccionamiento',
          iconName: 'keyboard_arrow_right',
          route: 'admbodegas/mainfraccionamiento',
          children: [
            {
              displayName: 'Fraccionamiento',
              iconName: 'keyboard_arrow_right',
              route: 'fraccionamientoproductos',
            },
            {
              displayName: 'Consulta Fraccionamiento',
              iconName: 'keyboard_arrow_right',
              route: 'consultafraccionamiento',
            },
            {
              displayName: 'Devolución Fraccionamiento',
              iconName: 'keyboard_arrow_right',
              route: 'devolucionfraccionamiento',
            },
          ]
        },
       
        
        {
          displayName: 'Libro Controlado',
          iconName: 'keyboard_arrow_right',
          route: 'admbodegas/mainlibrocontrolado',
          children: [
            {
              displayName: 'Cierre',
              iconName: 'keyboard_arrow_right',
              route: 'librocontrolado'
            },
            {
              displayName: 'Consulta',
              iconName: 'keyboard_arrow_right',
              route: 'consultalibrocontrolado'
            }
          ]
        },
        {
          displayName: 'Kardex',
          iconName: 'keyboard_arrow_right',
          route: 'admbodegas/mainkardex',
          children: [
            {
              displayName: 'Cierre',
              iconName: 'keyboard_arrow_right',
              route: 'cierrekardex'
            },
            {
              displayName: 'Consulta',
              iconName: 'keyboard_arrow_right',
              route: 'consultadekardex'
            }
          ]
        },
        // {
        //   displayName: 'Ajustes',
        //   iconName: 'keyboard_arrow_right',
        //   route: 'admbodegas/ajustes',
        //   children: [
        //     {
        //       displayName: 'Ajuste Stock',
        //       iconName: 'keyboard_arrow_right',
        //       route: 'ajustestock'
        //     }
        //   ]
        // },
      ],
    },
    /** menu Mov.Bodegas */
    {
      displayName: 'Movimientos Bodegas',
      iconName: 'keyboard_arrow_right',
      route: 'movbodegas',
      children: [
        {
          displayName: 'Generar Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'creasolicitud'
        },
        {
          displayName: 'Despachar Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'despachosolicitudes'
        },
        {
          displayName: 'Recepcionar Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'recepcionsolicitudes'
        },
        {
          displayName: 'Devolver Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'devolucionsolicitudes'
        },
        {
          displayName: 'Recepcionar Devolución entre Bodegas',
          iconName: 'keyboard_arrow_right',
          route: 'recepciondevolucionbodegas'
        },
        {
          displayName: 'Reposición Artículos',
          iconName: 'keyboard_arrow_right',
          route: 'reposicionarticulos'
        },
        {
          displayName: 'Control Stock Mínimo',
          iconName: 'keyboard_arrow_right',
          route: 'controlstockminimo'
        },
        {
          displayName: 'Recepción Devolución Paciente',
          iconName: 'keyboard_arrow_right',
          route: 'recepciondevolucionpaciente'
        },
        {
          displayName: 'Consulta de Saldos por Bodega',
          iconName: 'keyboard_arrow_right',
          route: 'consultasaldosporbodegas'
        },
        {
          displayName: 'Consulta de Lotes',
          iconName: 'keyboard_arrow_right',
          route: 'consultalotes'
        },
      ]
    },
    /** menu Mov.Pacientes */
    {
      displayName: 'Pacientes',
      iconName: 'keyboard_arrow_right',
      route: 'movpacientes',
      children: [
        {
          displayName: 'Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'solicitudpaciente'
        },
        {
          displayName: 'Dispensar Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'dispensarsolicitudespacientes'
        },
        {
          displayName: 'Crea/Dispensa Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'creadispensasolicitudpaciente'
        },
        {
          displayName: 'Generar Devolución',
          iconName: 'keyboard_arrow_right',
          route: 'generadevolucionpaciente'
        },
        // {
        //   displayName: 'Recepcionar Devolución',
        //   iconName: 'keyboard_arrow_right',
        //   route: 'devolucionpacientes'
        // },
        {
          displayName: 'Creación Recetas Ambulatorias',
          iconName: 'keyboard_arrow_right',
          route: 'creacionrecetasambulatorias'
        },
        {
          displayName: 'Despacho Recetas',
          iconName: 'keyboard_arrow_right',
          route: 'despachorecetasambulatoria'
        },
        // {
        //   displayName: 'Consulta Recetas Programada',
        //   iconName: 'keyboard_arrow_right',
        //   route: 'consultarecetasambulatoria'
        // },
        /** menu Busq. Cuentas */
        {
          displayName: 'Búsqueda en Cuentas',
          iconName: 'keyboard_arrow_right',
          route: 'busquedacuentas'
        },
        {
          displayName: 'Consumo de Pacientes por Bodega',
          iconName: 'keyboard_arrow_right',
          route: 'consumopacienteporbodega'
        },
      ]
    },


    /** menu Consumo */
    {
      displayName: 'Consumo',
      iconName: 'keyboard_arrow_right',
      route: 'consumo',
      children: [
        {
          displayName: 'Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'solicitudconsumo'
        },
        {
          displayName: 'Plantillas',
          iconName: 'keyboard_arrow_right',
          route: 'plantillaconsumo'
        }
      ]
    },
    /** menu Autopedido */
    {
      displayName: 'Autopedido',
      iconName: 'keyboard_arrow_right',
      route: 'autopedido',
      children: [
        {
          displayName: 'Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'autopedido'
        },
        {
          displayName: 'Devoluciones',
          iconName: 'keyboard_arrow_right',
          route: 'devolucionautopedido'
        }
      ]
    },
    

    /** Menú Reportes */
    {
      displayName: 'Reportes',
      iconName: 'keyboard_arrow_right',
      route: 'reportes',
      children: [
        {
          displayName: 'Reimpresión Solicitudes',
          iconName: 'keyboard_arrow_right',
          route: 'reimpresionsolicitudes'
        },
        {
          displayName: 'Lista Conteo Inventario',
          iconName: 'keyboard_arrow_right',
          route: 'informeconteolistainventario'
        },
        // {
        //   displayName: 'Consolidado por Devoluciones',
        //   iconName: 'keyboard_arrow_right',
        //   route: 'informeconsolidadodevoluciones'
        // },
        {
          displayName: 'Consumo por Bodega',
          iconName: 'keyboard_arrow_right',
          route: 'inftendencias'
        },
        {
          displayName: 'Pedidos Gasto Servicio',
          iconName: 'keyboard_arrow_right',
          route: 'infpedidosgastoservicio'
        }
      ]
    },

    /** menu Usr. Roles */
    {
      displayName: 'Administrador Roles Usuario',
      iconName: 'keyboard_arrow_right',
      route: 'rolesusuarios'
    },
    /** menu Integracion */
    {
      displayName: 'Integración',
      iconName: 'keyboard_arrow_right',
      route: 'integracion',
      children: [
        {
          displayName: 'Visor Cargos',
          iconName: 'keyboard_arrow_right',
          route: 'PanelIntegracionCargosComponent'
        },
        {
          displayName: 'Visor ERP',
          iconName: 'keyboard_arrow_right',
          route: 'PanelIntegracionERPComponent'
        }
      ]
    },
    /** Cambia Enlace */
    {
      displayName: 'Cambia Enlace Rsc',
      iconName: 'keyboard_arrow_right',
      route: 'cambiaenlacersc'
    },
    /** menu Acerca de */
    {
      displayName: 'Acerca de',
      iconName: 'keyboard_arrow_right',
      route: 'acercade',
      children: [
        {
          displayName: 'Versiones',
          iconName: 'keyboard_arrow_right',
          route: 'versiones'
        }]
    },
  ];

  constructor() {
  }
}
