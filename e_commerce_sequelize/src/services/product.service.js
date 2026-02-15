const { Product } = require('../models');

const createProduct = async (payload) => {
  const product = await Product.create(payload);
  return product;
};

const getAllProducts = async () => {
  return Product.findAll();
};

const getProductById = async (id) => {
  return Product.findByPk(id);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  await product.update(data);
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  await product.destroy();
  return true;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
