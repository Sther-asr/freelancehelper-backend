/**
 * Funiones para validar las peticones, si no contiene las caracteristicas apropiadas no puede continuar
*/

import { numeroParametros, validarDatosRegistroPersona } from "./validador";

export const sesionExistente = async (peticion, respuesta, next) =>{
    try {
        // sesion debe ser True boolean para realizar la consulta // idSesion es idPersona
        if(peticion.body.sesion =="" || peticion.body.sesion == undefined || peticion.body.sesion !== true){
            console.log('Error de sesion');
            respuesta.json({"Error":"Sesion no existente, error de sesion"});
            return;
        }
        console.log('Sesion valida');
        // si todo va bien, permitir la ejecucion de la otra peticion
        next();
    } catch (e) {
        console.log('Error: '+e.message);
        respuesta.json({"Error":e.message});
        return;
    }
}

export const datosCorrectos = async (peticion, respuesta, next) =>{
    try {
        // retorna true/false --> se le pasan un obtento de elementos y un entero igual (si el entero es distinto a 6 se ejecuta todo)
        let result = validarDatosRegistroPersona(peticion.body, numeroParametros(peticion.body));
        if(!result.result){
            console.log(result.alerta);
            respuesta.json({"Error":"formato de datos inválido", "alerta":result.alerta});
            return;
        }
        // si todo va bien, permitir la ejecucion de la otra peticion
        next();
    } catch (e) {
        console.log('Error: '+e.message);
        respuesta.json({"Error":e.message});
        return;
    }
}