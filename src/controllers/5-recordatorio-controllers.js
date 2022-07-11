/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import { numeroParametros } from "../assets/validador";

/**
 * controladores  recordatorio
 */

export const registraRecordatorio = async (peticion, respuesta) => {
  try {
    console.log("Registrando recordatorio");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSesion);
    const [resultado] = await objetoConexion.query(
      "INSERT INTO recordatorio (descripcion, fechaInicio, fechaFin, estado, persona_idPersona) VALUES (?,?,?,?,?)",
      [
        peticion.body.descripcion,
        peticion.body.fechaInicio,
        peticion.body.fechaFin,
        peticion.body.estado,
        idPersona,
      ]
    );
    respuesta.json({ registro: true, resultado });
    console.log(resultado);
  } catch (e) {
    console.log("Error al registrar recordatorio\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

export const consultaRecordatorio = async (peticion, respuesta) => {
  try {
    const idPersona = parseInt(peticion.body.idSesion);
    console.log("Realizando consulta recordatorio");
    const objetoConexion = await conexion();
    const [resultado] = await objetoConexion.query(
      "SELECT * FROM recordatorio WHERE persona_idPersona = ? ORDER BY fechaFin ASC",
      [idPersona]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta del recordatorio": e.message });
  }
};

export const actualizarRecordatorio = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSesion);
    const [resultado] = await objetoConexion.query(
      "UPDATE recordatorio SET descripcion=?, fechaInicio=?, fechaFin=?, estado=? WHERE persona_idPersona =? AND idRecordatorio =?",
      [
        peticion.body.descripcion,
        peticion.body.fechaInicio,
        peticion.body.fechaFin,
        peticion.body.estado,
        idPersona,
        peticion.body.idRecordatorio,
      ]
    );
    console.log(resultado);
    respuesta.json({ resultado });
  } catch (e) {
    console.log("Error al actualizar\n" + e.message);
    respuesta.json({ "Error durante la actualizacion": e.message });
  }
};

export const eliminarRecordatorio = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion del recordatorio");
    const objetoConexion = await conexion();
    console.log(peticion.body);
    const idPersona = parseInt(peticion.body.idSesion);
    const [resultado] = await objetoConexion.query(
      "DELETE FROM recordatorio WHERE idRecordatorio =? AND persona_idPersona =?",
      [peticion.body.idRecordatorio, idPersona]
    );
    if(resultado.affectedRows === 0){
        respuesta.json({resultado: false, info:resultado});
        return;
    }
    console.log({resultado: true, info:resultado});
    respuesta.json({resultado: true, info:resultado});
    
  } catch (e) {
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar recordatorio": e.message });
  }
};
