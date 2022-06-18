/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";

/**
 * controladores reordatorio_tags
 */

export const registraRecordatorioTag = async(peticion, respuesta)=>{
    try {
        console.log('Registrando relacion recordatorio tgas');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query('INSERT INTO recordatorio_tags (tag_idTag, recordatorio_idRecordatorio) VALUES (?,?)',
            [peticion.body.tag_idTag, peticion.body.recordatorio_idRecordatorio]
        );
        respuesta.json({"registro":true, resultado});
        console.log(resultado);
    } catch (e) {
        console.log('Error al registrar relacion recordatorio tags\n'+e.message);
        respuesta.json({"tipo de Error":e.message});  
    }
}

export const consultaRecordatorioTag = async (peticion, respuesta)=>{
    try {
        console.log('Realizando consulta tag recordatorio');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query(
            "SELECT recordatorio_tags.* FROM recordatorio_tags INNER JOIN recordatorio WHERE recordatorio_tags.recordatorio_idRecordatorio = recordatorio.idRecordatorio AND recordatorio.idRecordatorio = ?"
            ,[peticion.body.idRecordatorio]    
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n'+e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const actualizarRecordatorioTag = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE recordatorio_tags SET tag_idTag=?, recordatorio_idRecordatorio=? WHERE id_recordatorio_tags=?",
            [peticion.body.tag_idTag, peticion.body.idRecordatorio, peticion.body.idRecordatorioTag]
        );
        console.log(resultado);
        respuesta.json({resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarRecordatorioTag = async (peticion, respuesta) =>{
    try {
        // la cantidad de parametros enviados por medio de la peticion deben ser los necesarios
        if(numeroParametros(peticion.body) !== 4){
            console.log('Error al pasar numero de parametros');
            respuesta.json({"Error":"Cantidad de parametros requeridos"});
            return;
        }
        console.log('Ejecutando eliminacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado]= await objetoConexion.query(
            "DELETE FROM recordatorio_tags WHERE id_recordatorio_tags =? AND recordatorio_idRecordatorio =?",
            [peticion.body.idRecordatorioTag, peticion.body.idRecordatorio]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}