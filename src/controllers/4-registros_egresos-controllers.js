/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";

/**
 * controladores egresos
 */

export const registraEgreso = async(peticion, respuesta)=>{
    try {
        console.log('Registrando egreso');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query('INSERT INTO registros_egresos (motivo, monto, fecha, persona_idPersona) VALUES (?,?,?,?)',
            [peticion.body.motivo, peticion.body.monto, peticion.body.fecha, peticion.body.persona_idPersona]
        );
        console.log(resultado);
        respuesta.json({registro: true, resultado})
    } catch (e) {
       console.log('Error durante registro Egreso\n'+e.message);
       respuesta.json({"tipo de Error":e.message});
    }
}

export const consultaSaldo = async(peticion, respuesta, next)=>{
    try {
        console.log('Consultando saldo');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query(
            'SELECT (SUM(monto)-(SELECT SUM(monto)  FROM registros_egresos WHERE persona_idPersona = ?)) AS saldo FROM registros_ingresos WHERE persona_idPersona = ?',
            [peticion.body.persona_idPersona, peticion.body.persona_idPersona]
        );
        if(resultado[0].saldo === null){
            console.log("El saldo es null");
            const mensaje = `El saldo es insuficiente ${resultado[0].saldo}`;
            respuesta.json({registro: false, "resultado":mensaje});
            return;
        }
        if(resultado[0].saldo <= 0){
            console.log("Saldo insuficiente");
            const mensaje = `El saldo es insuficiente ${resultado[0].saldo}`;
            respuesta.json({registro: false, "resultado":mensaje});
            return;
        }
        if((resultado[0].saldo - peticion.body.monto) < 0){
            console.log("Saldo insuficiente ingrese un egreso menor");
            const mensaje = `El saldo es insuficiente ${resultado[0].saldo}`;
            respuesta.json({registro: false, "resultado":mensaje});
            return;
        }
        next();
        
    } catch (e) {
       console.log('Error durante consulta de saldo\n'+e.message);
       respuesta.json({"tipo de Error":e.message});
    }
}

export const consultaEgresos = async (peticion, respuesta)=>{
    try {
        let resultado = [];
        const idPersona = parseInt(peticion.body.idSesion);
        console.log('Realizando consulta egresos');
        const objetoConexion = await conexion();
        // si no hay rango de fechas se consultan todos los ingresos
        if(peticion.body.rangoInicio == undefined || peticion.body.rangoFin == undefined){
            resultado = await objetoConexion.query("SELECT motivo, monto, fecha, persona_idPersona FROM registros_egresos WHERE persona_idPersona = ?",[idPersona]);
        }else{
            resultado = await objetoConexion.query("SELECT motivo, monto, fecha, persona_idPersona FROM registros_egresos WHERE persona_idPersona = ? AND (fecha >= ? AND fecha <= ? )",
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

export const actualizarEgreso = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE registros_egresos SET motivo=?, monto=?, fecha=? WHERE persona_idPersona =? AND idEgreso =?",
            [peticion.body.motivo, peticion.body.monto, peticion.body.fecha, idPersona, peticion.body.idEgreso]
        );
        console.log(resultado);
        respuesta.json({resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const eliminarEgreso = async (peticion, respuesta) =>{
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
            "DELETE FROM registros_egresos WHERE idEgreso =? AND persona_idPersona =?",
            [peticion.body.idEgreso, idPersona]
        );
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error al eliminar\n'+e.message);
        respuesta.json({"Error al eliminar":e.message});
    }
}