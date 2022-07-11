/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";
import md5 from "md5";
/**
 * controladores usuario
 */

export const consultaTodosUsuarios = async (peticion, respuesta)=>{
    try {
        console.log('Realizando consulta');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query("SELECT * FROM persona");
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n'+ e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const consultaDatosSesionInicio = async (peticion, respuesta)=>{
    try {
        //si los datos estan vacios o no enviados retornar
        if(peticion.body.usuario =="" || peticion.body.usuario == undefined || peticion.body.contrasena =="" || peticion.body.contrasena == undefined ){
            console.log('Datos indefinidos o vacios');
            respuesta.json({"Error":"Datos vacios o indefinidos"});
            return;
        }
        // contando la cantidad de usuario con datos similares
        console.log('Realizando consulta datos inicio seseion');
        const contrasenaMD5 = md5(peticion.body.contrasena);
        const objetoConexion = await conexion();
        const [resultadoConteo] = await objetoConexion.query("SELECT COUNT(idUsuario) AS cantidad FROM usuario WHERE usuario = ? AND contrasena = ?",
            [peticion.body.usuario, contrasenaMD5]
        );
        console.log(resultadoConteo[0].cantidad);
        // si hay usuarios retornar idUsuario
        if(resultadoConteo[0].cantidad == 1){
            const [resultado] = await objetoConexion.query("SELECT persona_idPersona FROM usuario WHERE usuario = ? AND contrasena = ?",[peticion.body.usuario, contrasenaMD5]);
            console.log(resultado[0]);
            respuesta.json(resultado[0]);
            
        }else{
            console.log('No existe el usuario o los datos están equivocados');
            respuesta.json({"respuesta":"No existe el usuario o los datos están equivocados"});
        }   
    } catch (e) {
        console.log('Error durante la consulta\n'+ e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}
export const consultaDatosUsuario = async(peticion, respuesta)=>{
    try {
        console.log('Ejecutando consulta que obtiene la información del usuario');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSession);
        const [resultado] = await objetoConexion.query(
            "SELECT usuario, correo FROM usuario WHERE persona_idPersona  = ?",
            [idPersona]
        );
        console.log(resultado[0]);
        respuesta.json(resultado[0]);
    } catch (e) {
        console.log('Error durante la consulta para obtener la información del usuario\n'+e.message);
        respuesta.json({"Error durante la consulta para obtener la información del usuario": e.message});
    }
}
export const actualizarUsuario = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion del usuario');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSession);
        const [resultado] = await objetoConexion.query(
            "UPDATE usuario SET usuario = ?, correo = ? WHERE persona_idPersona = ?",
            [peticion.body.usuario, peticion.body.correo, idPersona]
        );
        console.log(resultado);
        respuesta.json(resultado);
    }catch (e) {
        console.log('Error al actualizar usuario\n'+e.message);
        respuesta.json({"Error durante la actualizacion del usuario": e.message});
    }
}

export const actualizarContrasenaUsuario = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const contrasenaMD5 = md5(peticion.body.contrasena);
        const idPersona = parseInt(peticion.body.idSession);
        const [resultado] = await objetoConexion.query(
            "UPDATE usuario SET contrasena = ? WHERE correo = ? AND persona_idPersona = ?",
            [contrasenaMD5, peticion.body.correo, idPersona]
        );
        if(resultado.affectedRows ===0 ){
            console.log(resultado);
            respuesta.json({"actualizacion": false, resultado});
            return;
        }
        console.log(resultado);
        respuesta.json({"actualizacion": true, resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        // respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarUsuario = async (peticion, respuesta) =>{
    try {
        // la cantidad de parametros enviados por medio de la peticion deben ser los necesarios
        if(numeroParametros(peticion.body) !== 4){
            console.log('Error al pasar numero de parametros');
            respuesta.json({"Error":"Cantidad de parametros requeridos"});
            return
        }
        console.log('Ejecutando eliminacion');
        const objetoConexion = await conexion();
        const contrasenaMD5 = md5(peticion.body.contrasena);
        const idPersona = parseInt(peticion.body.idSession);
        const [resultado]= await objetoConexion.query(
            "DELETE FROM usuario WHERE correo = ? AND contrasena = ? AND persona_idPersona =?",
            [peticion.body.correo, contrasenaMD5, idPersona]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}