"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistController = void 0;
const prisma_1 = require("../config/prisma");
const zod_1 = require("zod");
const addSchema = zod_1.z.object({
    producto_id: zod_1.z.number().int().positive(),
});
exports.wishlistController = {
    async obtener(req, res) {
        const lista = await prisma_1.prisma.cli_lista_deseos.findUnique({
            where: { cliente_id: req.user.id },
            include: { productos: { include: { producto: { include: { imagenes: true, categoria: true, stock: true } } } } },
        });
        res.json({ success: true, data: lista ?? { cliente_id: req.user.id, productos: [] } });
    },
    async agregar(req, res) {
        const { producto_id } = addSchema.parse(req.body);
        const lista = (await prisma_1.prisma.cli_lista_deseos.findUnique({ where: { cliente_id: req.user.id } })) ??
            (await prisma_1.prisma.cli_lista_deseos.create({ data: { cliente_id: req.user.id } }));
        const item = await prisma_1.prisma.cli_lista_deseos_productos.upsert({
            where: { lista_id_producto_id: { lista_id: lista.id, producto_id } },
            create: { lista_id: lista.id, producto_id },
            update: {},
        });
        res.status(201).json({ success: true, data: item });
    },
    async quitar(req, res) {
        const productoId = Number(req.params.productoId);
        const lista = await prisma_1.prisma.cli_lista_deseos.findUnique({ where: { cliente_id: req.user.id } });
        if (!lista)
            return res.json({ success: true, message: 'Wishlist vacía' });
        await prisma_1.prisma.cli_lista_deseos_productos.deleteMany({
            where: { lista_id: lista.id, producto_id: productoId },
        });
        res.json({ success: true, message: 'Eliminado de wishlist' });
    },
};
//# sourceMappingURL=wishlist.controller.js.map