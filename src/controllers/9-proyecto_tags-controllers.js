/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";

/**
 * controladores proyecto_tags
 */

export const registraProyectoTag = async(peticion, respuesta)=>{
    let idTag = undefined;
    try {
        console.log('Registrando tag');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query('INSERT INTO tag (descripcion) VALUES (?)',
            [peticion.body.descripcion]
        );
        console.log(resultado);
        idTag = resultado.insertId;
    } catch (e) {
        console.log('Error al registrar recordatorio\n'+e.message);
        respuesta.json({"tipo de Error":e.message});  
        return;
    }
    try {
        console.log('Registrando relacion tag de proyecto');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query('INSERT INTO proyecto_tags (tag_idTag, proyecto_idProyecto) VALUES (?,?)',
            [idTag, peticion.body.proyecto_idProyecto]
        );
        respuesta.json({"registro":true, resultado});
        console.log(resultado);
    } catch (e) {
        console.log('Error al registrar relacion tag de proyecto\n'+e.message);
        respuesta.json({"tipo de Error":e.message});  
    }
}

export const consultaProyectoTag = async (peticion, respuesta)=>{
    try {
        console.log('Realizando consulta tags proyecto');
        const idProyecto = parseInt(peticion.body.idProyecto);
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query(
            "SELECT proyecto_tags.tag_idTag, proyecto_tags.proyecto_idProyecto , tag.descripcion FROM proyecto_tags INNER JOIN tag ON tag.idTag = proyecto_tags.tag_idTag INNER JOIN proyecto WHERE proyecto_tags.proyecto_idProyecto = proyecto.idProyecto AND proyecto.idProyecto = ?",
            [idProyecto]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n');
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const actualizarProyectoTag = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE proyecto_tags SET tag_idTag=?, proyecto_idProyecto=? WHERE id_proyecto_tag=?",
            [peticion.body.idTag, peticion.body.idProyecto, peticion.body.idProyectoTag]
        );
        console.log(resultado);
        respuesta.json({resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarProyectoTag = async (peticion, respuesta) =>{
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
            "DELETE FROM proyecto_tags WHERE id_proyecto_tag =? AND proyecto_idProyecto",
            [peticion.body.idProyectoTag, peticion.body.idProyecto]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}