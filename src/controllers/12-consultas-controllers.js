/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
const date = require('date-and-time');
/**
 * controladores actividad
 */
export const consultaTareasDiarias = async (peticion, respuesta) => {

  try {

    console.log("Realizando consulta diaria");
    const date = require('date-and-time')
    const idPersona = parseInt(peticion.body.idSession);
    const objetoConexion = await conexion();
    const fecha = peticion.body.fechaFin;
    let fechaAnterior = date.format(new Date(fecha),'YYYY-MM-DD');

    let resultado;
    let resultado2;

    //Recordatorios
    try {
        resultado = await objetoConexion.query(
            "SELECT r.idRecordatorio, r.descripcion, r.fechaInicio, r.fechaFin, r.estado, r.persona_idPersona FROM recordatorio r WHERE ( DATE(r.fechaFIN) BETWEEN ? AND ?) AND persona_idPersona = ?",
            [fechaAnterior, peticion.body.fechaFin, idPersona]
        );
    } catch (e) {
        console.log('Error durante la consulta de Recordatorios\n'+e.message);
    }

    //Actividades
    try {
      
      resultado2 = await objetoConexion.query(
            "SELECT a.idActividad, a.descripcion, a.fechaInicio, a.fechaFin, a.estado, a.proyecto_idProyecto, p.idProyecto, p.persona_idPersona FROM actividad a JOIN proyecto p ON a.proyecto_idProyecto = p.idProyecto WHERE (DATE(a.fechaFIN) BETWEEN ? AND ?) AND p.persona_idPersona= ?",
            [fechaAnterior, peticion.body.fechaFin, idPersona]
        );
    } catch (e) {
        console.log('Error durante la consulta de Actividades\n'+e.message);
    }

    //Juntar ambos arrays en arrayTareas
    var arrayTareas = resultado[0].concat(resultado2[0]);

    //Ordenar objetos del array por fechaFin
    arrayTareas.sort(function compare(a, b) {
      var dateA = new Date(a.fechaFin);
      var dateB = new Date(b.fechaFin);
      return dateA - dateB;
    });

    // Formatear campos fechaFin/fechaInicio por 'YYYY-MM-DD HH:mm:ss'
    //Y eliminar tareas viejas terminadas
    for(let i = 0; i < arrayTareas.length; i++){
      
      let fin = arrayTareas[i]["fechaFin"];
      const finNuevo = date.format(fin,'YYYY-MM-DD HH:mm:ss');

      let inicio = arrayTareas[i]["fechaInicio"];
      const inicioNuevo = date.format(inicio,'YYYY-MM-DD HH:mm:ss');

      arrayTareas[i]["fechaFin"] = finNuevo;
      arrayTareas[i]["fechaInicio"] = inicioNuevo;

      if((date.format(new Date(arrayTareas[i]["fechaFin"]),'YYYY-MM-DD')) 
      < (fecha) && arrayTareas[i]["estado"] == 'Terminado'){

        arrayTareas.splice(i, 1);
      }
     
    }
    respuesta.json(arrayTareas)
   
  } catch (e) {
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

export const actualizarEstadoTareasDiarias = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta diaria");
    const idPersona = parseInt(peticion.body.idSession);
    const objetoConexion = await conexion();

    if(peticion.body.tipo == "Recordatorio"){
      const [resultado] = await objetoConexion.query("UPDATE recordatorio SET estado=? WHERE idRecordatorio=?", [peticion.body.estado,peticion.body.id]);
    }

    if(peticion.body.tipo == "Actividad"){
      const [resultado] = await objetoConexion.query("UPDATE actividad SET estado=? WHERE idActividad=?", [peticion.body.estado,peticion.body.id]);
    }

    console.log({"registro":true});
    respuesta.json({"registro":true});

  } catch (e) {
    console.log('Error al actualizar estado de tareas\n'+e.message);
    respuesta.json({"tipo de Error":e.message});  
  }
}
