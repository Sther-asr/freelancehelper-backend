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
    // const date = require("date-and-time");
    const idPersona = parseInt(peticion.body.idSession);
    const objetoConexion = await conexion();
    // const fecha = peticion.body.fechaFin;
    // let fechaAnterior = date.format(new Date(fecha), "YYYY-MM-DD");

    let resultado = [];
    let resultado2 = [];

    //Recordatorios
    try {
      [resultado] = await objetoConexion.query(
        "SELECT r.idRecordatorio, r.descripcion, r.fechaInicio, r.fechaFin, r.estado, r.persona_idPersona FROM recordatorio r WHERE r.estado = 1 AND r.persona_idPersona = ? ORDER BY r.fechaFin ASC",
        [idPersona]
      );
    } catch (e) {
      console.log("Error durante la consulta de Recordatorios\n" + e.message);
    }

    //Actividades
    try {
      [resultado2] = await objetoConexion.query(
        "SELECT a.idActividad, a.descripcion, a.fechaInicio, a.fechaFin, a.estado, a.proyecto_idProyecto, p.idProyecto, p.persona_idPersona FROM actividad a JOIN proyecto p ON a.proyecto_idProyecto = p.idProyecto WHERE a.estado = 1 AND persona_idPersona = ? ORDER BY a.fechaFin ASC",
        [idPersona]
      );
    } catch (e) {
      console.log("Error durante la consulta de Actividades\n" + e.message);
    }

    //Juntar ambos arrays en arrayTareas
    var arrayTareas = resultado.concat(resultado2);

    //Ordenar objetos del array por fechaFin
    arrayTareas.sort(function compare(a, b) {
      var dateA = new Date(a.fechaFin);
      var dateB = new Date(b.fechaFin);
      return dateA - dateB;
    });

    // Formatear campos fechaFin/fechaInicio por 'YYYY-MM-DD HH:mm:ss'
    for (let i = 0; i < arrayTareas.length; i++) {
      let fin = arrayTareas[i]["fechaFin"];
      const finNuevo = date.format(fin, "YYYY-MM-DD HH:mm");

      let inicio = arrayTareas[i]["fechaInicio"];
      const inicioNuevo = date.format(inicio, "YYYY-MM-DD HH:mm");

      arrayTareas[i]["fechaFin"] = finNuevo;
      arrayTareas[i]["fechaInicio"] = inicioNuevo;
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

export const consultaMontoTotalMovimientos = async (peticion, respuesta) =>{
  try {
    console.log("Realizando consulta monto total movimientos");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSession);
    const [egresos] = await objetoConexion.query("SELECT round(SUM(monto),2) AS totalEgresos FROM registros_egresos WHERE persona_idPersona = ?",
                      [idPersona]
    );
    const [ingresos] = await objetoConexion.query("SELECT round(SUM(monto),2) AS totalIngresos FROM registros_ingresos WHERE persona_idPersona = ?",
                      [idPersona]
    );
    const [egresosMes] = await objetoConexion.query("SELECT round(SUM(monto),2) AS totalEgresos FROM registros_egresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
                      [peticion.body.fecha, idPersona]
    );
    const [ingresosMes] = await objetoConexion.query("SELECT round(SUM(monto),2) AS totalIngresos FROM registros_ingresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
                      [peticion.body.fecha, idPersona]
    );
    const saldo = (ingresos[0].totalIngresos - egresos[0].totalEgresos).toFixed(2);
    let ahorro = ((saldo / 100) * 10 ).toFixed(2);
    if(ahorro<=0){
      ahorro = 0;
    }
    respuesta.json({"totalEgresos":egresosMes[0].totalEgresos, "totalIngresos":ingresosMes[0].totalIngresos, "saldo":saldo, "ahorro":ahorro});
  } catch (e) {
    console.log(
      "Error durante la consulta de totales de ingresos\n" + e.message
    );
    respuesta.json({
      "Error durante la consulta de totales de ingresos": e.message,
    });
  }
}

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

export const actualizarProyectoTerminado = async (peticion, respuesta, next) => {
  try {
    console.log(`Realizando consulta de actividades`);
    const idPersona = parseInt(peticion.body.idSession);
    const objetoConexion = await conexion();
    console.log(peticion.body)
    
    const [numActividTerminada] = await objetoConexion.query("SELECT COUNT(*) AS noTerminadas FROM actividad WHERE proyecto_idProyecto = ? AND estado = ?",
        [peticion.body.idProyecto, "Activo"]
    );
    console.log(numActividTerminada[0]);
    // si hay actividades activas retornar y salir del controlador
    if(numActividTerminada[0].noTerminadas !== 0){

      const [proyectoActivo] = await objetoConexion.query("UPDATE proyecto SET estado = ? WHERE idProyecto = ?",["Activo", peticion.body.idProyecto]);

      const [eliminarIngreso] = await objetoConexion.query("DELETE FROM registros_ingresos WHERE proyecto_idProyecto = ?", [peticion.body.idProyecto]);
      
      respuesta.json({"registro":false, "noTerminadas":numActividTerminada[0].noTerminadas});

      return;
    }

    const [actualizaProyecto] = await objetoConexion.query("UPDATE proyecto SET estado = ? WHERE idProyecto = ?",
          ["Terminado", peticion.body.idProyecto]
    );
    console.log('Filas actualizadas: '+actualizaProyecto.affectedRows);
    //si no se pudo actualizar el estado retornar
    if(actualizaProyecto.affectedRows === 0){
      respuesta.json({"actualizarProyect":false, "resultado":actualizaProyecto});
      return;
    }
    
    // console.log({"registro":true});
    // respuesta.json({"registro":true});

    next();

  } catch (e) {
    console.log('Error actualizar estado de proyecto\n'+e.message);
    respuesta.json({"tipo de Error":e.message});  
  }
}

export const registroIngresoProyecto =  async (peticion, respuesta) => {
  try {
    console.log(`Realizando consulta de descripcion`);
    const idPersona = parseInt(peticion.body.idSession);
    const idProyecto = parseInt(peticion.body.idProyecto);
    const objetoConexion = await conexion();
    console.log(peticion.body)
    // consulta si existe ingreso con esta id
    const [ingresoSimilar] = await objetoConexion.query("SELECT COUNT(*) AS similar FROM registros_ingresos WHERE proyecto_idProyecto = ?",[idProyecto]);

    if(ingresoSimilar[0].similar !== 0){
      console.log("Existe un ingreso para este proyecto");
      respuesta.json({"registro":false});
      return;
    }

    const [resultado] = await objetoConexion.query("INSERT INTO registros_ingresos (motivo, monto, fecha, proyecto_idProyecto, persona_idPersona) VALUES ( (SELECT proyecto.descripcion FROM proyecto WHERE proyecto.idProyecto = ?), (SELECT proyecto.monto FROM proyecto WHERE proyecto.idProyecto = ?), ?, ?, ?)",
        [idProyecto, idProyecto, peticion.body.fecha, idProyecto, idPersona]
    );
    console.log("Registro exitoso de ingreso de proyecto");
    // si hay actividades activas retornar y salir del controlador
    // if(numActividTerminada[0].noTerminadas !== 0){
    //   respuesta.json({"registro":false, "noTerminadas":numActividTerminada[0].noTerminadas});
    //   return;
    // }
    
    // console.log({"registro":true});
    respuesta.json({"registro":true, "resultado":resultado});

  } catch (e) {
    console.log('Error al registrar ingreso de proyecto\n'+e.message);
    respuesta.json({"tipo de Error":e.message});  
  }
}