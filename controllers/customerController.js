const Customer = require('../models/customer');
const Company = require('../models/company');
const updatableFields = [ 'name' ];

const validateRelation = async (body) => {
	if ('company' in body && (await Company.findById(body.company)) === null) {
		return false;
	}

	return true;
};

module.exports = class CustomerController {
	constructor() {}

	// fetch all records
	async list(req, res) {
		try {
			const customers = await Customer.find().populate('company');
			res.json(customers);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// fetch a record by id
	async get(req, res) {
		res.send(res.customer);
	}

	// create
	// company field must be valid and existing id for a company.
	async create(req, res) {
		if (!await validateRelation(req.body)) {
			res.status(422).json({ message: 'Related resources not found.' });
			return;
		}

		const customer = new Customer({
			name: req.body.name,
			company: req.body.company
		});
		try {
			const newCustomer = await customer.save();
			await Company.findByIdAndUpdate(req.body.company, { $push: { customers: newCustomer._id } });
			res.status(201).json(newCustomer);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// update function filters and update those updatableFields only
	async update(req, res) {
		for (let field of updatableFields) {
			res.customer[field] = req.body[field];
		}
		try {
			const updated = await res.customer.save();
			res.json(updated);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	async delete(req, res) {
		try {
			await res.customer.remove();
			res.json({ message: 'Resource Deleted.' });
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}
};
