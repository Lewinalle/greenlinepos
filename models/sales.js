const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema(
	{
		items: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: {
					type: Number,
					required: true
				}
			}
		],
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
			required: true
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true
		},
		description: {
			type: String
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Sales', salesSchema);
