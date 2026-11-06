-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `jewelleryType` VARCHAR(100) NULL,
    ADD COLUMN `variant` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `billingAddress` TEXT NULL,
    ADD COLUMN `couponCode` VARCHAR(50) NULL,
    ADD COLUMN `customerNotes` TEXT NULL,
    ADD COLUMN `customerPhone` VARCHAR(25) NULL,
    ADD COLUMN `transactionId` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `customer_addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `fullName` VARCHAR(150) NULL,
    `phone` VARCHAR(25) NULL,
    `addressLine1` VARCHAR(255) NOT NULL,
    `addressLine2` VARCHAR(255) NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `postalCode` VARCHAR(20) NOT NULL,
    `country` VARCHAR(50) NOT NULL DEFAULT 'India',
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `customer_addresses_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `prevStatus` VARCHAR(50) NOT NULL,
    `newStatus` VARCHAR(50) NOT NULL,
    `comment` TEXT NULL,
    `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'Admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_status_history_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customer_addresses` ADD CONSTRAINT `customer_addresses_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_status_history` ADD CONSTRAINT `order_status_history_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
