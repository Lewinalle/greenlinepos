const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true
		},
		category: {
			type: String
		},
		price: {
			type: Number
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
