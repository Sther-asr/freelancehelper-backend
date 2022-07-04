import { Router } from "express";
/**
 * rutas peticiones 
 */
import {consultaTareasDiarias, actualizarEstadoTareasDiarias, consultaMovimientos, consultaMontoTotalMovimientos, actualizarPerfil} from "../controllers/12-consultas-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'consultas';
/**
 * Rutas
 */
router.post(`/tareasDiarias`, sesionExistente,consultaTareasDiarias);
router.post(`/actualizar/estado`, sesionExistente, actualizarEstadoTareasDiarias);
router.post(`/consultaMovimientos`, sesionExistente, consultaMovimientos);
router.post(`/consultaMontoTotalMovimientos`, sesionExistente, consultaMontoTotalMovimientos);
router.post(`/actualizar/perfil`, sesionExistente, actualizarPerfil);
// export default router;
module.exports = router;