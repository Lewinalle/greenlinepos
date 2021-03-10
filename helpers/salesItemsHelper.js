// helper function to build updated Sales.items when adding an item.
// if payload's product id already exists in one of the Sales.items, it adds up the quantities.
// if payload's product id does not exist in any of the Sales.items, add a new item object to Sales.items.
exports.buildAddedItems = (items, productId, quantity) => {
	const index = items.findIndex((item) => item.product == productId);

	if (index != -1) {
		items[index].quantity = items[index].quantity + quantity;
		return items;
	}

	items.push({
		product: productId,
		quantity
	});

	return items;
};

// helper function to build updated Sales.items when removing an item.
// if payload's product id exists in one of the Sales.items, it subtracts the new quantity from old quantity. if it goes below 0, it removes the item object from Sales.items.
// if payload's product id does not exist in any of the Sales.items, it just returns the same Sales.items.
exports.buildRemovedItems = (items, productId, quantity) => {
	const index = items.findIndex((item) => item.product == productId);

	if (index != -1) {
		if (quantity > -1) {
			const newQuantity = items[index].quantity - quantity;
			if (newQuantity >= 0) {
				items[index].quantity = newQuantity;
				return items;
			}
		}
		items.splice(index, 1);
	}

	return items;
};
