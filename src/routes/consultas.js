import { Router } from "express";
/**
 * rutas peticiones 
 */
import {consultaTareasDiarias, actualizarEstadoTareasDiarias} from "../controllers/12-consultas-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'consultas';
/**
 * Rutas
 */
router.post(`/tareasDiarias`, sesionExistente,consultaTareasDiarias);
router.post(`/actualizarEstado`, sesionExistente, actualizarEstadoTareasDiarias);
// export default router;
module.exports = router;