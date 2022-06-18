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
        console.log('Realizando consulta actividad proyecto');
        const idProyecto = parseInt(peticion.body.idProyecto);
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query(
            "SELECT actividad.* FROM actividad INNER JOIN proyecto ON proyecto.idProyecto = actividad.proyecto_idProyecto AND proyecto.idProyecto = ?"
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
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE actividad SET descripcion=?, fechaInicio=?, fechaFin=?, estado=? WHERE proyecto_idProyecto =? AND idActividad=?",
            [peticion.body.descripcion, peticion.body.fechaInicio, peticion.body.fechaFin, peticion.body.estado, peticion.body.idProyecto, peticion.body.idActividad]
        );
        console.log(resultado);
        respuesta.json({resultado});
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
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}