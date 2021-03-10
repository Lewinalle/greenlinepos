const Product = require('../models/product');
const Company = require('../models/company');
const updatableFields = [ 'name', 'category', 'price' ];

const validateRelation = async (body) => {
	if ('company' in body && (await Company.findById(body.company)) === null) {
		return false;
	}

	return true;
};

module.exports = class ProductController {
	constructor() {}

	// fetch all records
	async list(req, res) {
		try {
			const products = await Product.find().populate('company');
			res.json(products);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// fetch a record by id
	async get(req, res) {
		res.send(res.product);
	}

	// create
	// company field must be valid and existing id for a company.
	async create(req, res) {
		if (!await validateRelation(req.body)) {
			res.status(422).json({ message: 'Related resources not found.' });
			return;
		}

		const product = new Product({
			name: req.body.name,
			company: req.body.company,
			category: req.body.category,
			price: req.body.price
		});
		try {
			const newProduct = await product.save();
			await Company.findByIdAndUpdate(req.body.company, { $push: { products: newProduct._id } });
			res.status(201).json(newProduct);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// update function filters and update those updatableFields only
	async update(req, res) {
		for (let field of updatableFields) {
			res.product[field] = req.body[field];
		}
		try {
			const updated = await res.product.save();
			res.json(updated);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	async delete(req, res) {
		try {
			await res.product.remove();
			res.json({ message: 'Resource Deleted.' });
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}
};
