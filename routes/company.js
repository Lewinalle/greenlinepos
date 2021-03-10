const express = require('express');
const router = express.Router();
const fetchResourceMiddleware = require('../middlewares/fetchResource');
const validator = require('../middlewares/validators');
const companyController = require('../controllers/companyController');

const controller = new companyController();

// fetch all
router.get('/', controller.list);

// fetch by id
router.get('/:id', fetchResourceMiddleware, controller.get);

// create
router.post('/', validator, controller.create);

// update
router.put('/:id', [ validator, fetchResourceMiddleware ], controller.update);

// delete
router.delete('/:id', fetchResourceMiddleware, controller.delete);

module.exports = router;
