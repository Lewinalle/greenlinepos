const Company = require('../models/company');
const updatableFields = [ 'name' ];

module.exports = class CompanyController {
	constructor() {}

	// fetch all records
	async list(req, res) {
		try {
			const companies = await Company.find();
			res.json(companies);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// fetch a record by id
	async get(req, res) {
		res.send(res.company);
	}

	// create
	// name field is unique required.
	async create(req, res) {
		const company = new Company({
			name: req.body.name
		});
		try {
			const newCompany = await company.save();
			res.status(201).json(newCompany);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	// update function filters and update those updatableFields only
	async update(req, res) {
		for (let field of updatableFields) {
			res.company[field] = req.body[field];
		}
		try {
			const updated = await res.company.save();
			res.json(updated);
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}

	async delete(req, res) {
		try {
			await res.company.remove();
			res.json({ message: 'Resource Deleted.' });
		} catch (err) {
			res.status(422).json({ message: err.message });
		}
	}
};
