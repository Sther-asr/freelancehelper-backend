import { Router } from "express";
/**
 * rutas peticiones 
 */
import {consultaTareasDiarias} from "../controllers/12-consultas-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'consultas';
/**
 * Rutas
 */
router.post(`/tareasDiarias`, consultaTareasDiarias);

// export default router;
module.exports = router;