
export const environment = {
  production: true, /*el código de firebaseConfig se copia de la página de firebase según 
  los datos que se crean cuando se crea un nuevo proyecto en dicha página */

  URLServiciosRest:{

    // IP. Enlace Fusat
    URLConexionSolicitudConsumo: "http://10.188.185.10:8093", 
    URLConexion:  "http://10.188.185.10:8091",   
    URLConexionInformes: "http://10.188.185.10:8092",
    URLInterfaces : "http://10.188.185.10:8094",
    
    
    ambiente:"TESTING",


     //IP. Pública Fusat   logisticoqa
    //URLConexionSolicitudConsumo: "http://198.41.33.191:8093", 
    //URLConexion:  "http://198.41.33.191:8091",   
    //URLConexionInformes: "http://198.41.33.191:8092",
    //URLInterfaces : "http://198.41.33.191:8094",
    //ambiente:"TESTING",
 

 },

  privilegios:{
    privilegio: null,
    usuario   : null, 
    holding   : null,
    empresa   : null,
    sucursal  : null
  },


};

