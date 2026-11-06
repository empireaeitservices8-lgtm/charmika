-- AlterTable
ALTER TABLE `customers` ADD COLUMN `address` TEXT NULL,
    ADD COLUMN `city` VARCHAR(100) NULL,
    ADD COLUMN `postalCode` VARCHAR(20) NULL,
    ADD COLUMN `state` VARCHAR(100) NULL,
    ADD COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `productImage` VARCHAR(500) NULL,
    ADD COLUMN `productName` VARCHAR(200) NOT NULL DEFAULT '',
    ADD COLUMN `sku` VARCHAR(100) NULL,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `deliveryCharge` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `paymentMethod` VARCHAR(50) NOT NULL DEFAULT 'UPI',
    ADD COLUMN `stockDeducted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `orders_orderStatus_idx` ON `orders`(`orderStatus`);

-- CreateIndex
CREATE INDEX `orders_paymentStatus_idx` ON `orders`(`paymentStatus`);
