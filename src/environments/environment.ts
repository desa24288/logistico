
export const environment = {
  production: false, /*el código de firebaseConfig se copia de la página de firebase según 
  los datos que se crean cuando se crea un nuevo proyecto en dicha página */

  URLServiciosRest: {
        // URLConexion: "http://172.27.17.103:8091",//Walter
        // URLConexionSolicitudConsumo: "http://172.27.17.103:8093",//Walter
        // URLConexionInformes: "http://172.27.17.103:8092", //walter
        URLInterfaces : "http://172.27.17.103:8094", //walter
     
   // URLInterfaces : "http://172.25.108.236:8094", //carlos
   URLConexion: "http://172.25.108.85:8091",//Ariel
   URLConexionSolicitudConsumo: "http://172.25.108.85:8093",//Ariel
   URLConexionInformes: "http://172.25.108.85:8092",//Ariel antes 8194
    // URLConexion: "http://localhost:8091",

   //URLConexion: "http://172.25.108.236:8091", //Carlos
    ambiente: "DESARROLLO",
  },

  privilegios: {
    privilegio: null,
    usuario: null,
    holding: null,
    empresa: null,
    sucursal: null
  },

};


