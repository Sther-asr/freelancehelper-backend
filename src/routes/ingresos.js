import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraIngreso, consultaIngresos, actualizarIngreso, eliminarIngreso} from "../controllers/3-registros_ingresos-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'ingresos';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraIngreso);
router.get(`/consulta`, sesionExistente, consultaIngresos);
router.put(`/actualizar`, sesionExistente, actualizarIngreso);
router.delete(`/eliminar`, sesionExistente, eliminarIngreso);

// export default router;
module.exports = router;