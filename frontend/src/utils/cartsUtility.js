// Function to add decimals and return a string with two decimal places
export const formatPrice = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// NOTE: The code below has been adjusted to fix an issue
// with type coercion of strings to numbers.
// The formatPrice function expects a number and returns a string,
// so it's important to avoid passing a string as an argument.

export const updateShoppingCart = (state) => {
  // Calculate the total price of items in whole numbers (pennies) 
  // to avoid issues with floating point number calculations
  const itemsTotal = state.cartItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );
  state.itemsTotal = formatPrice(itemsTotal);

  // Calculate the shipping price based on the items total
  const shippingCost = itemsTotal > 100 ? 0 : 10;
  state.shippingCost = formatPrice(shippingCost);

  // Calculate the tax price (15% tax)
  const taxAmount = 0.15 * itemsTotal;
  state.taxAmount = formatPrice(taxAmount);

  // Calculate the final total price by adding items price, shipping, and tax
  const grandTotal = itemsTotal + shippingCost + taxAmount;
  state.grandTotal = formatPrice(grandTotal);

  // Save the updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
