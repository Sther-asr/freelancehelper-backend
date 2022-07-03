/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
const date = require("date-and-time");
/**
 * controladores actividad
 */
export const consultaTareasDiarias = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta diaria");
    const date = require("date-and-time");
    const idPersona = parseInt(peticion.body.idSession);
    const objetoConexion = await conexion();
    const fecha = peticion.body.fechaFin;
    let fechaAnterior = date.format(new Date(fecha), "YYYY-MM-DD");

    let resultado;
    let resultado2;

    //Recordatorios
    try {
      resultado = await objetoConexion.query(
        "SELECT r.idRecordatorio, r.descripcion, r.fechaInicio, r.fechaFin, r.estado, r.persona_idPersona FROM recordatorio r WHERE ( DATE(r.fechaFIN) BETWEEN ? AND ?) AND persona_idPersona = ?",
        [fechaAnterior, peticion.body.fechaFin, idPersona]
      );
    } catch (e) {
      console.log("Error durante la consulta de Recordatorios\n" + e.message);
    }

    //Actividades
    try {
      resultado2 = await objetoConexion.query(
        "SELECT a.idActividad, a.descripcion, a.fechaInicio, a.fechaFin, a.estado, a.proyecto_idProyecto, p.idProyecto, p.persona_idPersona FROM actividad a JOIN proyecto p ON a.proyecto_idProyecto = p.idProyecto WHERE (DATE(a.fechaFIN) BETWEEN ? AND ?) AND p.persona_idPersona= ?",
        [fechaAnterior, peticion.body.fechaFin, idPersona]
      );
    } catch (e) {
      console.log("Error durante la consulta de Actividades\n" + e.message);
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
    for (let i = 0; i < arrayTareas.length; i++) {
      let fin = arrayTareas[i]["fechaFin"];
      const finNuevo = date.format(fin, "YYYY-MM-DD HH:mm:ss");

      let inicio = arrayTareas[i]["fechaInicio"];
      const inicioNuevo = date.format(inicio, "YYYY-MM-DD HH:mm:ss");

      arrayTareas[i]["fechaFin"] = finNuevo;
      arrayTareas[i]["fechaInicio"] = inicioNuevo;

      if (
        date.format(new Date(arrayTareas[i]["fechaFin"]), "YYYY-MM-DD") <
          fecha &&
        arrayTareas[i]["estado"] == "Terminado"
      ) {
        arrayTareas.splice(i, 1);
      }
    }
    respuesta.json(arrayTareas);
  } catch (e) {
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

export const actualizarEstadoTareasDiarias = async (peticion, respuesta) => {
  try {
    console.log(`Realizando actualización de ${peticion.body.tipo}`);
    const idPersona = parseInt(peticion.body.idSession);
    const objetoConexion = await conexion();
    console.log(peticion.body);
    if (peticion.body.tipo == "Recordatorio") {
      const [resultado] = await objetoConexion.query(
        "UPDATE recordatorio SET estado=? WHERE idRecordatorio=?",
        [peticion.body.estado, peticion.body.id]
      );
      console.log("R\n" + JSON.stringify(resultado));
    }

    if (peticion.body.tipo == "Actividad") {
      const [resultado] = await objetoConexion.query(
        "UPDATE actividad SET estado=? WHERE idActividad=?",
        [peticion.body.estado, peticion.body.id]
      );
      console.log("A\n" + JSON.stringify(resultado));
    }

    console.log({ registro: true });
    respuesta.json({ registro: true });
  } catch (e) {
    console.log("Error al actualizar estado de tareas\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

export const consultaMovimientos = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta movimientos");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSession);
    let resultado, resultadoIngresos, resultadoEgresos;

    if (peticion.body.tipo == "Diario") {
      [resultadoIngresos] = await objetoConexion.query(
        "SELECT * FROM registros_ingresos WHERE (DAY(fecha) = DAY(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );

      [resultadoEgresos] = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE (DAY(fecha) = DAY(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
    } else if (peticion.body.tipo == "Mensual") {
      [resultadoIngresos] = await objetoConexion.query(
        "SELECT * FROM registros_ingresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
      [resultadoEgresos] = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
    } else if (peticion.body.tipo == "Anual") {
      [resultadoIngresos] = await objetoConexion.query(
        "SELECT * FROM registros_ingresos WHERE (YEAR(fecha) = YEAR(?)) AND persona_idPersona = ? ORDER BY fecha DESC",
        [peticion.body.fecha, idPersona]
      );
      [resultadoEgresos] = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE (YEAR(fecha) = YEAR(?)) AND persona_idPersona = ? ORDER BY fecha DESC",
        [peticion.body.fecha, idPersona]
      );
    } else if (peticion.body.tipo == "Rango") {
      [resultadoIngresos] = await objetoConexion.query(
        "SELECT * FROM registros_ingresos WHERE (fecha BETWEEN ? AND ? ) AND persona_idPersona = ?",
        [peticion.body.fechaInicio, peticion.body.fechaFin, idPersona]
      );
      [resultadoEgresos] = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE (fecha BETWEEN ? AND ? ) AND persona_idPersona = ?",
        [peticion.body.fechaInicio, peticion.body.fechaFin, idPersona]
      );
    }

    resultado = resultadoIngresos.concat(resultadoEgresos);

    //Ordenar objetos del array por fecha
    resultado.sort(function compare(a, b) {
      var dateA = new Date(a.fecha);
      var dateB = new Date(b.fecha);
      return dateA - dateB;
    });
    // formateando fechas con una funcion robada <3
    for (let i = 0; i < resultado.length; i++) {
      let fecha = resultado[i]["fecha"];
      const fechaNueva = date.format(fecha, "YYYY/MM/DD HH:mm");
      resultado[i]["fecha"] = fechaNueva;
    }

    //console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    console.log(
      "Error durante la consulta de registros de ingresos\n" + e.message
    );
    respuesta.json({
      "Error durante la consulta de registros de ingresos": e.message,
    });
  }
};

export const consultaMontoTotalMovimientos = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta monto total movimientos");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSession);
    const [egresos] = await objetoConexion.query(
      "SELECT round(SUM(monto),2) AS totalEgresos FROM registros_egresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
      [peticion.body.fecha, idPersona]
    );
    const [ingresos] = await objetoConexion.query(
      "SELECT round(SUM(monto),2) AS totalIngresos FROM registros_ingresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
      [peticion.body.fecha, idPersona]
    );
    const saldo = (ingresos[0].totalIngresos - egresos[0].totalEgresos).toFixed(
      2
    );
    const ahorro = ((saldo / 100) * 10).toFixed(2);
    respuesta.json({
      totalEgresos: egresos[0].totalEgresos,
      totalIngresos: ingresos[0].totalIngresos,
      saldo: saldo,
      ahorro: ahorro,
    });
  } catch (e) {
    console.log(
      "Error durante la consulta de totales de ingresos\n" + e.message
    );
    respuesta.json({
      "Error durante la consulta de totales de ingresos": e.message,
    });
  }
};

export const actualizarPerfil = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion del Perfil");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSession);
    let resultado;

    // Usuario
    try {
      [resultado] = await objetoConexion.query(
        "UPDATE usuario SET usuario.usuario = ?, usuario.correo = ? WHERE usuario.persona_idPersona = ?",
        [peticion.body.usuario, peticion.body.correo, idPersona]
      );
    } catch (e) {
      console.log(
        "Error al actualizar el perfil en la tabla usuario\n" + e.message
      );
      respuesta.json({
        "Error durante la actualizacion del perfil en la tabla usuario":
          e.message,
      });
    }

    // Persona
    try {
      [resultado] = await objetoConexion.query(
        "UPDATE persona SET persona.nombrePersona = ? WHERE persona.idPersona = ?",
        [peticion.body.nombrePersona, idPersona]
      );
    } catch (e) {
      console.log("Error al actualizar el perfil en la tabla persona\n" + e.message);
      respuesta.json({
        "Error durante la actualizacion del perfil en la tabla persona": e.message,
      });
    }
    console.log(resultado);
    respuesta.json({ "resultado" : true });
  } catch (e) {

    console.log("Error al actualizar el perfil\n" + e.message);
    respuesta.json({ "resultado" : false, "error": e.message }  );
  }
};
