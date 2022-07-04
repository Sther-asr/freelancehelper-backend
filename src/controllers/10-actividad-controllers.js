/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";

/**
 * controladores actividad
 */

export const registraActividad = async(peticion, respuesta)=>{
    try {
        console.log('Registrando actividad');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query('INSERT INTO actividad (descripcion, fechaInicio, fechaFin, estado, proyecto_idProyecto) VALUES (?,?,?,?,?)',
            [peticion.body.descripcion, peticion.body.fechaInicio, peticion.body.fechaFin, peticion.body.estado, peticion.body.proyecto_idProyecto]
        );
        respuesta.json({"registro":true, resultado});
        console.log(resultado);
    } catch (e) {
        console.log('Error al registrar actividad\n'+e.message);
        respuesta.json({"tipo de Error":e.message});  
    }
}

export const consultaActividad = async (peticion, respuesta)=>{
    try {
        console.log('Realizando consulta de actividades del proyecto');
        const idProyecto = parseInt(peticion.body.idProyecto);
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query(
            "SELECT * FROM actividad WHERE proyecto_idProyecto = ?"
            ,[idProyecto]    
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n'+e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const actualizarActividad = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion de la actividad');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query(
            "UPDATE actividad SET descripcion=?, fechaInicio=?, fechaFin=?, estado=? WHERE proyecto_idProyecto =? AND idActividad=?",
            [peticion.body.descripcion, peticion.body.fechaInicio, peticion.body.fechaFin, peticion.body.estado, peticion.body.proyecto_idProyecto, peticion.body.idActividad]
        );
        if(resultado.affectedRows === 0) {
            console.log(resultado);
            respuesta.json({resultado: "No se afectaron filas"});
            return;
        }
        console.log({resultado: true, info: resultado});
        respuesta.json({resultado: true, info: resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarActividad = async (peticion, respuesta) =>{
    try {
        // la cantidad de parametros enviados por medio de la peticion deben ser los necesarios
        if(numeroParametros(peticion.body) !== 4){
            console.log('Error al pasar numero de parametros');
            respuesta.json({"Error":"Cantidad de parametros requeridos"});
            return
        }
        console.log('Ejecutando eliminacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado]= await objetoConexion.query(
            "DELETE FROM actividad WHERE idActividad =? AND proyecto_idProyecto =?",
            [peticion.body.idActividad, peticion.body.idProyecto]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar actividad\n'+e.message);
        respuesta.json({"Error al eliminar actividad":e.message});
    }
}