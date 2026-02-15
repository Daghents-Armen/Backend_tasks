const { Order, OrderItem, Product } = require('../models');
const { sequelize } = require('../config/db');

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { items } = req.body;

    let total = 0;

    const order = await Order.create(
      { userId },
      { transaction: t }
    );

    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product || product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          message: 'Invalid product or insufficient stock'
        });
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

    res.status(201).json(order);

  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: {
        model: OrderItem,
        include: Product
      }
    });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: {
        model: OrderItem,
        include: Product
      }
    });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders
};
