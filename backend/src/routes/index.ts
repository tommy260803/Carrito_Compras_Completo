import { Router } from 'express';
import authRoutes from './auth.routes';
import productoRoutes from './producto.routes';
import categoriaRoutes from './categoria.routes';
import carritoRoutes from './carrito.routes';
import ordenRoute from './orden.routes';
import reporteRoutes from './reporte.routes';
import reportesRoutes from './reportes.routes';
import clienteRoutes from './cliente.routes';
import wishlistRoutes from './wishlist.routes';
import inventarioRoutes from './inventario.routes';
import pagoRoutes from './pago.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/productos', productoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/carrito', carritoRoutes);
router.use('/ordenes', ordenRoute);
router.use('/reportes', reporteRoutes);
router.use('/reportes-pdf', reportesRoutes);
router.use('/clientes', clienteRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/pagos', pagoRoutes);

export default router;