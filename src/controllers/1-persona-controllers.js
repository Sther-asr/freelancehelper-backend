/*
    funciones para las rutas de las peticiones
*/
import { conexion } from "../database";
import {numeroParametros} from "../assets/validador";
import md5 from "md5";
/**
 * controladores persona
*/
export const registraPersona = async(peticion, respuesta)=>{
    
    const objetoConexion = await conexion();
    // variable para validar registro
    let registro = false;
    
    //consultar usuario y correo
    console.log('consulta antes de registrar');
    //intentar realizar consulta
    try{
        const [resultado] = await objetoConexion.query(`SELECT COUNT(usuario) AS resultado FROM usuario WHERE usuario = ? OR correo = ?`,
            [peticion.body.usuario, peticion.body.correo]
        );
        console.log('Datos similares: '+resultado[0].resultado);
        // si no hay datos similares resgistro = true
        registro = resultado[0].resultado ===0 ? true : false;
        console.log(registro);
    }catch (e){
        console.log('Error al consultar datos similares durante el registro\n'+e.message);
    }
    
    //si no hubieron errores ni datos repetidos en la BDD
    if(registro){
        try{
            console.log('Registrando persona');
            const contrasenaMD5 = md5(peticion.body.contrasena);
            const [resultPersona] = await objetoConexion.query('INSERT INTO persona (nombrePersona, apellidoPersona, fechaNacimiento) VALUES (?,?,?)',
                [peticion.body.nombrePersona, peticion.body.apellidoPersona, peticion.body.fechaNacimiento]
            );
            console.log('registro persona:\n'+[resultPersona]);

            const [resultUsuario] = await objetoConexion.query('INSERT INTO usuario (usuario, contrasena, correo, persona_idPersona) VALUES (?,?,?,?)',
                [peticion.body.usuario, contrasenaMD5, peticion.body.correo, resultPersona.insertId]
            );
            console.log('registro usuario:\n'+[resultUsuario]);

            respuesta.json({registro: true})
        }catch(e){
            console.log('Error al registrar datos de nuevo usuario y persona\n'+e.message);
        }
    }else{
        respuesta.json({registro:false})
    }
}

export const consultaDatosPersona = async (peticion, respuesta)=>{
    try {
        const idPersona = parseInt(peticion.body.idSesion);
        console.log('Realizando consulta datos persona');
        const objetoConexion = await conexion();
        const [resultado] = await objetoConexion.query("SELECT * FROM persona WHERE idPersona = ?",[idPersona]);
        console.log(resultado);
        respuesta.json(resultado);
    } catch (e) {
        console.log('Error durante la consulta\n'+e.message);
        respuesta.json({"Error durante la consulta":e.message});
    }
}

export const actualizarPersona = async (peticion, respuesta)=> {
    try{
        console.log('Ejecutando actualizacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "UPDATE persona SET  nombrePersona = ?, apellidoPersona = ?, fechaNacimiento = ? WHERE idPersona = ?",
            [peticion.body.nombrePersona, peticion.body.apellidoPersona, peticion.body.sexo, peticion.body.fechaNacimiento, idPersona]
        );
        console.log(resultado);
        respuesta.json({resultado});
    }catch (e) {
        console.log('Error al actualizar\n'+e.message);
        respuesta.json({"Error durante la actualizacion": e.message});
    }
}

export const elimiarPersona = async (peticion, respuesta)=>{
    try {
        // la cantidad de parametros enviados por medio de la peticion deben ser los necesarios
        if(numeroParametros(peticion.body) !== 2){
            console.log('Error al pasar numero de parametros');
            respuesta.json({"Error":"Cantidad de parametros requeridos"});
            return
        }
        console.log('Ejecutando eliminacion');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        const [resultado] = await objetoConexion.query(
            "DELETE FROM persona WHERE idPersona = ?",
            [idPersona]  
        );
        console.log(resultado);
        respuesta.json({"eliminacion":true, resultado});
    } catch (e) {
        console.log('Error durante la eliminacion\n'+e.message);
        respuesta.json({"Error durante la eliminacion":e.message});
    }
}

export const listaDiaria = async(peticion, respuesta)=>{
    try {
        console.log('Ejecutando lista diaria');
        const objetoConexion = await conexion();
        const idPersona = parseInt(peticion.body.idSesion);
        
    } catch (e) {
        
    }
}

/**
 * 
SELECT
persona.*,
usuario.*,
registros_ingresos.*,
registros_egresos.*,
recordatorio.*,
recordatorio_tags.*,
tag.*,
proyecto.*,
proyecto_tags.*,
actividad.*,
nota.* 
FROM
persona
INNER JOIN usuario ON persona.idPersona = usuario.persona_idPersona
INNER JOIN registros_ingresos ON registros_ingresos.persona_idPersona = persona.idPersona
INNER JOIN registros_egresos ON registros_egresos.persona_idPersona = persona.idPersona
INNER JOIN recordatorio ON recordatorio.persona_idPersona = persona.idPersona
INNER JOIN recordatorio_tags ON recordatorio_tags.recordatorio_idRecordatorio = recordatorio.idRecordatorio
INNER JOIN tag ON tag.idTag = recordatorio_tags.tag_idTag
INNER JOIN proyecto ON proyecto.persona_idPersona = persona.idPersona
INNER JOIN proyecto_tags ON proyecto_tags.proyecto_idProyecto = proyecto.idProyecto
INNER JOIN actividad on actividad.proyecto_idProyecto = proyecto.idProyecto
INNER JOIN nota ON nota.actividad_idActividad = actividad.idActividad AND persona.idPersona = 17
 */