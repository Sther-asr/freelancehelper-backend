/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import { numeroParametros } from "../assets/validador";

/**
 * controladores proyecto
 */

export const registraProyecto = async (peticion, respuesta) => {
  try {
    console.log("Registrando proyecto");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSesion);
    const [resultado] = await objetoConexion.query(
      "INSERT INTO proyecto (descripcion, monto, fechaInicio, fechaFin, estado, persona_idPersona) VALUES (?,?,?,?,?,?)",
      [
        peticion.body.descripcion,
        peticion.body.monto,
        peticion.body.fechaInicio,
        peticion.body.fechaFin,
        peticion.body.estado,
        idPersona,
      ]
    );
    respuesta.json({ registro: true, resultado });
    console.log(resultado);
  } catch (e) {
    console.log("Error al registrar proyecto\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

export const consultaProyecto = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta Proyecto");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSesion);
    const [resultado] = await objetoConexion.query(
      "SELECT proyecto.idProyecto, proyecto.descripcion, proyecto.monto, proyecto.fechaInicio, proyecto.fechaFin, proyecto.estado FROM proyecto INNER JOIN persona ON persona.idPersona = proyecto.persona_idPersona AND persona.idPersona = ?",
      [idPersona]
    );

    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    console.log("Error durante la consulta\n");
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

export const actualizarProyecto = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion del proyecto");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSesion);
    const [resultado] = await objetoConexion.query(
      "UPDATE proyecto SET descripcion=?, monto=?, fechaInicio=?, fechaFin=?, estado=? WHERE persona_idPersona =? AND idProyecto=?",
      [
        peticion.body.descripcion,
        peticion.body.monto,
        peticion.body.fechaInicio,
        peticion.body.fechaFin,
        peticion.body.estado,
        idPersona,
        peticion.body.idProyecto,
      ]
    );
    console.log(resultado);
    respuesta.json({ resultado: true, info: resultado });
  } catch (e) {
    console.log("Error al actualizar\n" + e.message);
    respuesta.json({ "Error durante la actualizacion del proyecto": e.message });
  }
};

export const eliminarProyecto = async (peticion, respuesta) => {
  try {
    // la cantidad de parametros enviados por medio de la peticion deben ser los necesarios
    if (numeroParametros(peticion.body) !== 3) {
      console.log("Error al pasar numero de parametros");
      respuesta.json({ Error: "Cantidad de parametros requeridos" });
      return;
    }
    console.log("Ejecutando eliminacion");
    const objetoConexion = await conexion();
    const idPersona = parseInt(peticion.body.idSession);
    const [resultado] = await objetoConexion.query(
      "DELETE FROM proyecto WHERE idProyecto =? AND persona_idPersona =?",
      [peticion.body.idProyecto, idPersona]
    );

    console.log(resultado);
    respuesta.json({ resultado: true, info: resultado });
  } catch (e) {
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
