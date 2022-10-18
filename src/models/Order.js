const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema ({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	products: [{
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	}],
	status: {
		type: String,
		default: 'pending',
		enum: ['pending', 'verified', 'delivered', 'rejected']
	},
	totalAmount: Number
}, {timestamp: true});

module.exports = mongoose.model('Order', OrderSchema);