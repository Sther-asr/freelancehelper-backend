/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";
/**
 * controladores nota
 */

export const registraNota = async(peticion, respuesta)=>{
    try {
        console.log('Registrando nota');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query('INSERT INTO nota (descripcion, actividad_idActividad) VALUES (?,?)',
            [peticion.body.descripcion, peticion.body.actividad_idActividad]
        );
        respuesta.json({"registro":true, resultado});
        console.log(resultado);
    } catch (e) {
        console.log('Error al registrar nota\n'+e.message);
        respuesta.json({"tipo de Error":e.message});  
    }
}

export const consultaNota = async (peticion, respuesta)=>{
    try {
        console.log('Realizando consulta Nota');
        const idActividad = parseInt(peticion.body.idActividad);
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query(
            "SELECT nota.* FROM nota INNER JOIN actividad WHERE nota.actividad_idActividad = actividad.idActividad AND actividad.idActividad = ?",
            [idActividad]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n'+e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const actualizarNota = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE nota SET descripcion=? WHERE actividad_idActividad=? AND idNota=?",
            [peticion.body.descripcion, peticion.body.idActividad, peticion.body.idNota]
        );
        console.log(resultado);
        respuesta.json(resultado);
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarNota = async (peticion, respuesta) =>{
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
            "DELETE FROM nota WHERE idNota =? AND actividad_idActividad =?",
            [peticion.body.idNota, peticion.body.idActividad]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}