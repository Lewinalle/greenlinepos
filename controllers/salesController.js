const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const Sales = require('../models/sales');
const Customer = require('../models/customer');
const Product = require('../models/product');
const Company = require('../models/company');
const salesItemsHelper = require('../helpers/salesItemsHelper');
const updatableFields = [ 'description' ];

const itemsValidator = Joi.object({
	product: Joi.objectId().required(),
	quantity: Joi.number().greater(-1)
});

const validateRelation = async (body) => {
	if ('items' in body) {
		for (let item of body.items) {
			if ((await Product.findById(item.product)) === null) {
				return false;
			}
		}
	}

	if ('customer' in body && (await Customer.findById(body.customer)) === null) {
		return false;
	}

	if ('company' in body && (await Company.findById(body.company)) === null) {
		return false;
	}

	if ('product' in body && (await Product.findById(body.product)) === null) {
		return false;
	}

	return true;
};

module.exports = class SalesController {
	constructor() {}

	// fetch all records
	async list(req, res) {
		try {
			const sales = await Sales.find().populate('company').populate('customer');
			res.json(sales);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// fetch a record by id
	async get(req, res) {
		res.send(res.sales);
	}

	// create
	// items field must be array of object.
	// ex) [{ product: 'productId', quantity: 30 }]
	// customer field must be valid and existing id for a customer.
	// company field must be valid and existing id for a company.
	async create(req, res) {
		if (!await validateRelation(req.body)) {
			res.status(422).json({ message: 'Related resources not found.' });
			return;
		}

		const sales = new Sales({
			items: req.body.items,
			customer: req.body.customer,
			company: req.body.company,
			description: req.body.description
		});
		try {
			const newSales = await sales.save();
			res.status(201).json(newSales);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// update function filters and update those updatableFields only
	async update(req, res) {
		for (let field of updatableFields) {
			res.sales[field] = req.body[field];
		}
		try {
			const updated = await res.sales.save();
			res.json(updated);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	async delete(req, res) {
		try {
			await res.sales.remove();
			res.json({ message: 'Resource Deleted.' });
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// function to add sales item to Sales object's items.
	async addItem(req, res) {
		const { error, value } = itemsValidator.validate(req.body);
		if (error) {
			res.status(400).json({ message: `Validation error: ${error.details.map((x) => x.message).join(', ')}` });
		}

		if (!('quantity' in value)) {
			value.quantity = 1;
		}

		if (!await validateRelation(value)) {
			res.status(422).json({ message: 'Product is not found.' });
			return;
		}

		const newItems = salesItemsHelper.buildAddedItems(res.sales.items, value.product, value.quantity);
		res.sales.items = newItems;

		try {
			const updated = await res.sales.save();
			res.json(updated);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// function to remove sales item to Sales object's items.
	async removeItem(req, res) {
		const { error, value } = itemsValidator.validate(req.body);

		if (!('quantity' in value)) {
			value.quantity = -1;
		}

		if (error) {
			res.status(400).json({ message: `Validation error: ${error.details.map((x) => x.message).join(', ')}` });
		}

		if (!await validateRelation(value)) {
			res.status(422).json({ message: 'Product is not found.' });
			return;
		}

		const newItems = salesItemsHelper.buildRemovedItems(res.sales.items, value.product, value.quantity);
		res.sales.items = newItems;

		try {
			const updated = await res.sales.save();
			res.json(updated);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}
};
