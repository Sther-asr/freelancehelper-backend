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
    const idPersona = parseInt(peticion.body.idSession);
    const objetoConexion = await conexion();
    const fecha = peticion.body.fechaFin;

    const fechaAnterior = new Date(fecha);
    const fechaasjhd = new Date(fechaAnterior)
    fechaasjhd.setDate(fechaasjhd.getDate() + 1);

    let resultado;
    let resultado2;

    //Actividades
    try {
        resultado = await objetoConexion.query(
            "SELECT r.idRecordatorio, r.descripcion, r.fechaInicio, r.fechaFin, r.estado, r.persona_idPersona FROM recordatorio r WHERE ( DATE(r.fechaFIN) BETWEEN ? AND ?) AND estado = ? AND persona_idPersona = ?",
            [fechaAnterior, fechaasjhd, peticion.body.estado, idPersona]
        );
    } catch (e) {
        console.log('Error durante la consulta de Recordatorios\n'+e.message);
    }

    //Recordatorios
    try {
      
      resultado2 = await objetoConexion.query(
            "SELECT a.idActividad, a.descripcion, a.fechaInicio, a.fechaFin, a.estado, a.proyecto_idProyecto, p.idProyecto, p.persona_idPersona FROM actividad a JOIN proyecto p ON a.proyecto_idProyecto = p.idProyecto WHERE (DATE(a.fechaFIN) BETWEEN ? AND ?) AND a.estado = ? AND p.persona_idPersona= ?",
            [fechaAnterior, fechaasjhd, peticion.body.estado, idPersona]
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
    
    //Formatear campos fechaFin/fechaInicio por 'YYYY-MM-DD HH:mm:ss'
    for(let i = 0; i < arrayTareas.length; i++){
      
      let fin = arrayTareas[i]["fechaFin"];
      const finNuevo = date.format(fin,'YYYY-MM-DD HH:mm:ss');

      let inicio = arrayTareas[i]["fechaInicio"];
      const inicioNuevo = date.format(inicio,'YYYY-MM-DD HH:mm:ss');

      arrayTareas[i]["fechaFin"] = finNuevo;
      arrayTareas[i]["fechaInicio"] = inicioNuevo;
    }

    respuesta.json(arrayTareas)
    console.log(arrayTareas);
   
  } catch (e) {
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};
