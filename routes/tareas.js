const router = require('express').Router();
const c = require('../controllers/tareaController');

router.get('/', c.listar);
router.get('/nueva', c.formNueva);
router.post('/', c.crear);
router.get('/:id', c.detalle);
router.get('/:id/editar', c.formEditar);
router.post('/:id', c.actualizar);
router.post('/:id/eliminar', c.eliminar);

module.exports = router;
