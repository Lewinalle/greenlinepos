const express = require('express');
const router = express.Router();
const fetchResourceMiddleware = require('../middlewares/fetchResource');
const validator = require('../middlewares/validators');
const salesController = require('../controllers/salesController');

const controller = new salesController();

// fetch all
router.get('/', controller.list);

// fetch by id
router.get('/:id', fetchResourceMiddleware, controller.get);

// store
router.post('/', validator, controller.create);

// update
router.put('/:id', [ validator, fetchResourceMiddleware ], controller.update);

// delete
router.delete('/:id', fetchResourceMiddleware, controller.delete);

// add sales item to Sales object
router.post('/:id/addItem', fetchResourceMiddleware, controller.addItem);

// remove sales item from Sales object
router.post('/:id/removeItem', fetchResourceMiddleware, controller.removeItem);

module.exports = router;
