const { Order, OrderItem, Product } = require('../models');
const { sequelize } = require('../config/db');

const createOrder = async (userId, items) => {
  const t = await sequelize.transaction();

  try {
    let total = 0;

    const order = await Order.create({ userId }, { transaction: t });

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });

      if (!product || product.stock < item.quantity) {
        await t.rollback();
        throw new Error('Invalid product or insufficient stock');
      }

      const price = product.price;
      total += price * item.quantity;

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: price
      }, { transaction: t });

      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    order.total = total;
    await order.save({ transaction: t });

    await t.commit();
    return order;

  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getAllOrders = async () => {
  return Order.findAll({
    include: {
      model: OrderItem,
      include: Product
    }
  });
};

const getOrdersByUser = async (userId) => {
  return Order.findAll({
    where: { userId },
    include: {
      model: OrderItem,
      include: Product
    }
  });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser
};
