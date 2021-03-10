const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const getJoiSchema = (resourceName) => {
	let schema;

	switch (resourceName.toLowerCase()) {
		case 'company':
			schema = Joi.object({
				name: Joi.string().required()
			});
			break;
		case 'customer':
			schema = Joi.object({
				name: Joi.string().required(),
				company: Joi.objectId()
			});
			break;
		case 'product':
			schema = Joi.object({
				name: Joi.string().required(),
				company: Joi.objectId(),
				category: Joi.string(),
				price: Joi.number()
			});
			break;
		case 'sales':
			itemsSchema = Joi.object().keys({
				product: Joi.objectId().required(),
				quantity: Joi.number().required()
			});

			schema = Joi.object({
				items: Joi.array().items(itemsSchema).min(1).required(),
				customer: Joi.objectId(),
				company: Joi.objectId(),
				description: Joi.string()
			});
			break;
		default:
			break;
	}

	return schema;
};

module.exports = (req, res, next) => {
	const resourceName = req.originalUrl.split('/')[1];
	const schema = getJoiSchema(resourceName);

	const options = {
		abortEarly: false, // include all errors
		allowUnknown: true // ignore unknown props
	};

	const { error, value } = schema.validate(req.body, options);

	if (error) {
		res.status(400).json({ message: `Validation error: ${error.details.map((x) => x.message).join(', ')}` });
	} else {
		req.body = value;
		next();
	}
};
