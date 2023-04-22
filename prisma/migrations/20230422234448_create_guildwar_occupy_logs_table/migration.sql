-- CreateTable
CREATE TABLE `guildwar_occupy_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `mapName` VARCHAR(50) NOT NULL DEFAULT '',
    `guildId` INTEGER NOT NULL DEFAULT 0,
    `guildName` VARCHAR(32) NOT NULL DEFAULT '',
    `guildOptions` TEXT NOT NULL DEFAULT '',
    `attackerWin` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
