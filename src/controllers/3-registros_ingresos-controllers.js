/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from '../assets/validador';

/**
 * controladores ingresos
 */

export const registraIngreso = async(peticion, respuesta)=>{
    try {
        console.log('Registrando ingreso');
        const objetoConexion = await conexion();
        let infoRegistro = [peticion.body.motivo, peticion.body.monto, peticion.body.fecha, peticion.body.proyecto_idProyecto , peticion.body.persona_idPersona];

        if(peticion.body.proyecto_idProyecto == undefined){
            infoRegistro = [peticion.body.motivo, peticion.body.monto, peticion.body.fecha, peticion.body.persona_idPersona];
            const [resultado] = await objetoConexion.query('INSERT INTO registros_ingresos (motivo, monto, fecha, persona_idPersona) VALUES (?,?,?,?)', infoRegistro);
            respuesta.json({registro: true, resultado});
        }else{
            const [resultado] = await objetoConexion.query('INSERT INTO registros_ingresos (motivo, monto, fecha, proyecto_idProyecto, persona_idPersona) VALUES (?,?,?,?,?)', infoRegistro);
            respuesta.json({registro: true, resultado});
        }
    
        console.log(infoRegistro);
        
    } catch (e) {
       console.log('Error durante registro Ingreso\n'+e.message);
       respuesta.json({"tipo de Error":e.message});
    }
}

export const consultaIngresos = async (peticion, respuesta)=>{
    try {
        let resultado = [];
        const idPersona = parseInt(peticion.body.idSesion);
        console.log('Realizando consulta ingresos');
        const objetoConexion = await conexion();
        // si no hay rango de fechas se consultan todos los ingresos
        if(peticion.body.rangoInicio == undefined || peticion.body.rangoFin == undefined){
            resultado = await objetoConexion.query("SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE persona_idPersona = ?",[idPersona]);
        }else{
            resultado = await objetoConexion.query("SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE persona_idPersona = ? AND (fecha >= ? AND fecha <= ? )",
                [idPersona, peticion.body.rangoInicio, peticion.body.rangoFin]
            );
        }
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n'+e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const actualizarIngreso = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE registros_ingresos SET motivo =?, monto=?, fecha=? WHERE idIngreso =? AND persona_idPersona =?",
            [peticion.body.motivo, peticion.body.monto, peticion.body.fecha, peticion.body.idIngreso, idPersona]
        );
        console.log(resultado);
        respuesta.json({resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarIngreso = async (peticion, respuesta) =>{
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
            "DELETE FROM registros_ingresos WHERE idIngreso =? AND persona_idPersona =?",
            [peticion.body.idIngreso, idPersona]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}