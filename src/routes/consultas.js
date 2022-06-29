import { Router } from "express";
/**
 * rutas peticiones 
 */
import {consultaTareasDiarias, actualizarEstadoTareasDiarias, consultaMovimientos, consultaMontoTotalMovimientos} from "../controllers/12-consultas-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'consultas';
/**
 * Rutas
 */
router.post(`/tareasDiarias`, sesionExistente,consultaTareasDiarias);
router.post(`/actualizarEstado`, sesionExistente, actualizarEstadoTareasDiarias);
router.post(`/consultaMovimientos`, sesionExistente, consultaMovimientos);
router.post(`/consultaMontoTotalMovimientos`, sesionExistente, consultaMontoTotalMovimientos);
// export default router;
module.exports = router;