import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraEgreso, consultaEgresos, actualizarEgreso, eliminarEgreso} from "../controllers/4-registros_egresos-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'egresos';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraEgreso);
router.get(`/consulta`, sesionExistente, consultaEgresos);
router.put(`/actualizar`, sesionExistente, actualizarEgreso);
router.delete(`/eliminar`, sesionExistente, eliminarEgreso);


// export default router;
module.exports = router;