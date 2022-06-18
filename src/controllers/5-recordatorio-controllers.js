/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";

/**
 * controladores  recordatorio
 */

export const registraRecordatorio = async(peticion, respuesta)=>{
    try {
        console.log('Registrando recordatorio');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query('INSERT INTO recordatorio (descripcion, fechaInicio, fechaFin, estado, persona_idPersona) VALUES (?,?,?,?,?)',
            [peticion.body.descripcion, peticion.body.fechaInicio, peticion.body.fechaFin, peticion.body.estado, idPersona]
        );
        respuesta.json({"registro":true, resultado});
        console.log(resultado);
    } catch (e) {
        console.log('Error al registrar recordatorio\n'+e.message);
        respuesta.json({"tipo de Error":e.message});
    }
}

export const consultaRecordatorio = async (peticion, respuesta)=>{
    try {
        const idPersona = parseInt(peticion.body.idSesion);
        console.log('Realizando consulta recordatorio');
        const objetoConexion = await conexion();
        let resultado = [];
        // si no existe un rago de consultas, traer todas las tareas
        if(peticion.body.rangoInicio == "" || peticion.body.rangoInicio ==undefined  || peticion.body.rangoFin == "" || peticion.body.rangoInicio ==undefined){
            resultado = await objetoConexion.query(
                "SELECT recordatorio.* FROM recordatorio INNER JOIN persona WHERE persona.idPersona = recordatorio.persona_idPersona AND persona.idPersona = ?",
                [idPersona]
            );
        }else{
           resultado = await objetoConexion.query(
               "SELECT recordatorio.* FROM recordatorio INNER JOIN persona WHERE persona.idPersona = recordatorio.persona_idPersona AND persona.idPersona = ? AND recordatorio.fechaInicio >= ? AND (recordatorio.fechaFin >= ? OR recordatorio.fechaFin <= ?)",
               [idPersona, peticion.body.rangoInicio, peticion.body.rangoFin, peticion.body.rangoFin]
           );
        }
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n'+e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const actualizarRecordatorio = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE recordatorio SET descripcion=?, fechaInicio=?, fechaFin=?, estado=? WHERE persona_idPersona =? AND idRecordatorio =?",
            [peticion.body.descripcion, peticion.body.fechaInicio, peticion.body.fechaFin, peticion.body.estado, idPersona, peticion.body.idRecordatorio]
        );
        console.log(resultado);
        respuesta.json({resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarRecordatorio = async (peticion, respuesta) =>{
    try {
        // la cantidad de parametros enviados por medio de la peticion deben ser los necesarios
        if(numeroParametros(peticion.body) !== 3){
            console.log('Error al pasar numero de parametros');
            respuesta.json({"Error":"Cantidad de parametros requeridos"});
            return;
        }
        console.log('Ejecutando eliminacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado]= await objetoConexion.query(
            "DELETE FROM recordatorio WHERE idRecordatorio =? AND persona_idPersona =?",
            [peticion.body.idRecordatorio, idPersona]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}