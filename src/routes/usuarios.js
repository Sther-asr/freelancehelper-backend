import { Router } from "express";
/**
 * rutas peticiones 
 */
import {consultaDatosSesionInicio, actualizarUsuario, actualizarContrasenaUsuario,eliminarUsuario} from "../controllers/2-usuario-controllers";
import {sesionExistente, datosCorrectos} from "../assets/permisos-peticiones";
const router = Router();
const path = 'usuarios';
/**
 * Rutas
 */

router.post(`/consulta-inicio-sesion`, consultaDatosSesionInicio);
router.put(`/actualizar`, datosCorrectos, sesionExistente,
 actualizarUsuario);
router.put(`/actualizar-contrasena`, actualizarContrasenaUsuario);
router.delete(`/eliminar`, sesionExistente, eliminarUsuario);


// export default router;
module.exports = router;