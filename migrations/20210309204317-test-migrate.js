/**
 * 
 * commands:
 * migrate-mongo up / migrate-mongo down 
 * 
 */

module.exports = {
	async up(db, client) {
		const customers = await db.collection('customers').find({}).toArray();
		customers.map(async (customer) => {
			await db.collection('customers').updateMany(
				{ _id: customer._id },
				{
					$set: {
						// just as a random test, we map each resource id's last 2 characters to the new field called 'code'
						code: customer._id.toString().slice(-2)
					}
				}
			);
		});
	},

	async down(db, client) {
		await db.collection('customers').updateMany({}, { $unset: { code: null } });
	}
};
