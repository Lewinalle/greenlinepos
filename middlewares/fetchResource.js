const Company = require('../models/company');
const Customer = require('../models/customer');
const Product = require('../models/product');
const Sales = require('../models/sales');

const isIdFormatCorrect = (id) => {
	return id.match(/^[0-9a-fA-F]{24}$/);
};

// helper/middleware for fetching company by id
module.exports = async (req, res, next) => {
	// see if id is valid for the default mongoose objectId
	if (!isIdFormatCorrect(req.params.id)) {
		res.status(400).send({ message: 'id is not in the correct format.' });
	}

	let resource;
	const resourceName = req.originalUrl.split('/')[1];
	try {
		switch (resourceName.toLowerCase()) {
			case 'company': {
				resource = await Company.findById(req.params.id).populate('customers').populate('products');
				break;
			}
			case 'customer': {
				resource = await Customer.findById(req.params.id).populate('company');
				break;
			}
			case 'product': {
				resource = await Product.findById(req.params.id).populate('company');
				break;
			}
			case 'sales': {
				resource = await Sales.findById(req.params.id).populate('products').populate('customer');
				break;
			}
			default: {
				res.status(400).send({ message: 'The resource is not allowed for fetchResource middleware.' });
				break;
			}
		}
		if (resource === null) {
			return res.status(404).json({ message: `No ${resourceName} found.` });
		}
	} catch (err) {
		res.status(422).json({ message: err.message });
	}

	res[resourceName] = resource;
	next();
};
