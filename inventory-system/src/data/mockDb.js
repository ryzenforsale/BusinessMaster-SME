import mockDB from './mockDB.json';

export const getProducts = () => mockDB.products;
export const getOrders = () => mockDB.orders;
export const getManufacturing = () => mockDB.manufacturing;

export const findProductByCode = (code) => mockDB.products.find(p => p.product_code === code);

export const computeOrderTotal = (order) => {
  if (!order || !Array.isArray(order.products)) return 0;
  return order.products.reduce((sum, i) => sum + (Number(i.subtotal) || 0), 0);
};

export default {
  getProducts,
  getOrders,
  getManufacturing,
  findProductByCode,
  computeOrderTotal
};
