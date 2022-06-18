/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";

/**
 * controladores tag
 */

export const registraTag = async(peticion, respuesta)=>{
    try {
        console.log('Registrando tag');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query('INSERT INTO tag (descripcion) VALUES (?)',
            [peticion.body.descripcion]
        );
        respuesta.json({"registro":true, resultado});
        console.log(resultado);
    } catch (e) {
        console.log('Error al registrar recordatorio\n'+e.message);
        respuesta.json({"tipo de Error":e.message});  
    }
}

export const consultaTag = async (peticion, respuesta)=>{
    try {
        console.log('Realizando consulta tag');
        const idTag = parseInt(peticion.body.idTag);
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query("SELECT * FROM tag WHERE idTag = ?",[idTag]);
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n'+e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const actualizarTag = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE tag SET descripcion=? WHERE idTag=?",
            [peticion.body.descripcion, peticion.body.idTag]
        );
        console.log(resultado);
        respuesta.json({resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarTag = async (peticion, respuesta) =>{
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
            "DELETE FROM tag WHERE idTag =?",
            [peticion.body.idTag]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}