const prisma = require("../config/db");

/**
 * Atomically deducts product stock for a confirmed order inside a transaction.
 * Prevents negative inventory and rolls back completely if any item is out of stock.
 */
async function deductOrderStock(orderId, externalTx = null) {
  const runner = async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new Error(`Order #${orderId} not found.`);
    }

    // Prevent duplicate deductions
    if (order.stockDeducted) {
      return { success: true, message: "Stock was already deducted for this order." };
    }

    // Step 1: Pre-check stock for ALL items before deducting any
    for (const item of order.items) {
      const currentProduct = await tx.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, stock: true },
      });

      if (!currentProduct) {
        throw new Error(`Product '${item.productName}' (ID: ${item.productId}) no longer exists.`);
      }

      if (currentProduct.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for '${currentProduct.name}'. Required: ${item.quantity}, Available: ${currentProduct.stock}. Purchase cannot be fulfilled.`
        );
      }
    }

    // Step 2: Atomically deduct stock for each product
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Step 3: Mark order stock as deducted
    await tx.order.update({
      where: { id: orderId },
      data: { stockDeducted: true },
    });

    return { success: true, message: "Inventory deducted successfully." };
  };

  if (externalTx) {
    return runner(externalTx);
  } else {
    return prisma.$transaction(runner);
  }
}

/**
 * Atomically restores product stock when a confirmed order is cancelled or refunded.
 * Ensures stock is only restored once.
 */
async function restoreOrderStock(orderId, externalTx = null) {
  const runner = async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order #${orderId} not found.`);
    }

    // If stock was never deducted, there is nothing to restore
    if (!order.stockDeducted) {
      return { success: true, message: "No stock was previously deducted for this order." };
    }

    // Atomically restore stock for each product
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    // Mark stock as no longer deducted
    await tx.order.update({
      where: { id: orderId },
      data: { stockDeducted: false },
    });

    return { success: true, message: "Inventory restored successfully." };
  };

  if (externalTx) {
    return runner(externalTx);
  } else {
    return prisma.$transaction(runner);
  }
}

module.exports = {
  deductOrderStock,
  restoreOrderStock,
};

