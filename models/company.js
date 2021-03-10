const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		customers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Customer'
			}
		],
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product'
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
