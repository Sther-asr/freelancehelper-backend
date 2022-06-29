/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import { numeroParametros } from "../assets/validador";

/**
 * controladores ingresos
 */

export const registraIngreso = async (peticion, respuesta) => {
  try {
    console.log("Registrando ingreso");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSession);
    const [resultado] = await objetoConexion.query(
      "INSERT INTO registros_ingresos (motivo, monto, fecha, proyecto_idProyecto, persona_idPersona) VALUES (?,?,?,?,?)",
      [
        peticion.body.motivo,
        peticion.body.monto,
        peticion.body.fecha,
        peticion.body.proyecto_idProyecto,
        idPersona,
      ]
    );
    respuesta.json({ registro: true });

    console.log(resultado);
  } catch (e) {
    console.log("Error durante registro Ingreso\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

export const consultaIngresos = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta ingresos");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSession);
    let resultado;

    if (peticion.body.tipo == "Diario") {
      [resultado] = await objetoConexion.query(
        "SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE (DAY(fecha) = DAY(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
    } else if (peticion.body.tipo == "Mensual") {
      [resultado] = await objetoConexion.query(
        "SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
    } else if (peticion.body.tipo == "Anual") {
      [resultado] = await objetoConexion.query(
        "SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE (YEAR(fecha) = YEAR(?)) AND persona_idPersona = ? ORDER BY fecha DESC",
        [peticion.body.fecha, idPersona]
      );
    }

    console.log(resultado);
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

export const consultaIngresosRango = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta ingresos por rango");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSession);
    const [resultado] = await objetoConexion.query(
      "SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE (DATE(fecha) BETWEEN ? AND ?) AND persona_idPersona = ?",
      [peticion.body.fechaInicio, peticion.body.fechaFin, idPersona]
    );
    console.log(resultado);
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

export const actualizarIngreso = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSesion);
    const [resultado] = await objetoConexion.query(
      "UPDATE registros_ingresos SET motivo =?, monto=?, fecha=? WHERE idIngreso =? AND persona_idPersona =?",
      [
        peticion.body.motivo,
        peticion.body.monto,
        peticion.body.fecha,
        peticion.body.idIngreso,
        idPersona,
      ]
    );
    console.log(resultado);
    respuesta.json({ resultado });
  } catch (e) {
    console.log("Error al actualizar\n" + e.message);
    respuesta.json({ "Error durante la actualizacion": e.message });
  }
};

export const eliminarIngreso = async (peticion, respuesta) => {
  try {
    // la cantidad de parametros enviados por medio de la peticion deben ser los necesarios
    if (numeroParametros(peticion.body) !== 3) {
      console.log("Error al pasar numero de parametros");
      respuesta.json({ Error: "Cantidad de parametros requeridos" });
      return;
    }
    console.log("Ejecutando eliminacion");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSesion);
    const [resultado] = await objetoConexion.query(
      "DELETE FROM registros_ingresos WHERE idIngreso =? AND persona_idPersona =?",
      [peticion.body.idIngreso, idPersona]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
