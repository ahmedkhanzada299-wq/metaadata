-- CreateTable
CREATE TABLE `Countries` (
    `CountryID` INTEGER NOT NULL AUTO_INCREMENT,
    `CountryName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Countries_CountryName_key`(`CountryName`),
    PRIMARY KEY (`CountryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalDetails` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NULL,
    `Address` VARCHAR(191) NULL,
    `Postcode` VARCHAR(191) NULL,
    `City` VARCHAR(191) NULL,
    `DateOfBirth` DATETIME(3) NULL,
    `Gender` VARCHAR(191) NULL,
    `Phone` VARCHAR(191) NULL,
    `MothersMaidenName` VARCHAR(191) NULL,
    `Email` VARCHAR(191) NULL,
    `Ethnicity` VARCHAR(191) NULL,
    `ZodiacSign` VARCHAR(191) NULL,
    `Age` INTEGER NULL,
    `Height` DOUBLE NULL,
    `Weight` DOUBLE NULL,
    `EyeColor` VARCHAR(191) NULL,
    `HairColor` VARCHAR(191) NULL,
    `CountryID` INTEGER NOT NULL,

    UNIQUE INDEX `PersonalDetails_Phone_key`(`Phone`),
    UNIQUE INDEX `PersonalDetails_Email_key`(`Email`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialDetails` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `CreditCardType` VARCHAR(191) NULL,
    `CreditCardNumber` VARCHAR(191) NULL,
    `CreditCardExpiry` VARCHAR(191) NULL,
    `CreditCardCVV2` INTEGER NULL,
    `CountryID` INTEGER NOT NULL,

    UNIQUE INDEX `FinancialDetails_CreditCardNumber_key`(`CreditCardNumber`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InternetDetails` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserName` VARCHAR(191) NULL,
    `Password` VARCHAR(191) NULL,
    `IPv4Address` VARCHAR(191) NULL,
    `IPv6Address` VARCHAR(191) NULL,
    `UserAgent` VARCHAR(191) NULL,
    `CountryID` INTEGER NOT NULL,

    UNIQUE INDEX `InternetDetails_UserName_key`(`UserName`),
    UNIQUE INDEX `InternetDetails_IPv4Address_key`(`IPv4Address`),
    UNIQUE INDEX `InternetDetails_IPv6Address_key`(`IPv6Address`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EducationDetails` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Qualification` VARCHAR(191) NULL,
    `Institution` VARCHAR(191) NULL,
    `CountryID` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmploymentDetails` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `CompanyName` VARCHAR(191) NULL,
    `Salary` VARCHAR(191) NULL,
    `CompanyAddress` VARCHAR(191) NULL,
    `JobTitle` VARCHAR(191) NULL,
    `CompanyPhone` VARCHAR(191) NULL,
    `CompanyEmail` VARCHAR(191) NULL,
    `CountryID` INTEGER NOT NULL,

    UNIQUE INDEX `EmploymentDetails_CompanyEmail_key`(`CompanyEmail`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleDetails` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `VehicleName` VARCHAR(191) NULL,
    `LicensePlate` VARCHAR(191) NULL,
    `VIN` VARCHAR(191) NULL,
    `Color` VARCHAR(191) NULL,
    `CountryID` INTEGER NOT NULL,

    UNIQUE INDEX `VehicleDetails_LicensePlate_key`(`LicensePlate`),
    UNIQUE INDEX `VehicleDetails_VIN_key`(`VIN`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonalDetails` ADD CONSTRAINT `PersonalDetails_CountryID_fkey` FOREIGN KEY (`CountryID`) REFERENCES `Countries`(`CountryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialDetails` ADD CONSTRAINT `FinancialDetails_CountryID_fkey` FOREIGN KEY (`CountryID`) REFERENCES `Countries`(`CountryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternetDetails` ADD CONSTRAINT `InternetDetails_CountryID_fkey` FOREIGN KEY (`CountryID`) REFERENCES `Countries`(`CountryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EducationDetails` ADD CONSTRAINT `EducationDetails_CountryID_fkey` FOREIGN KEY (`CountryID`) REFERENCES `Countries`(`CountryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmploymentDetails` ADD CONSTRAINT `EmploymentDetails_CountryID_fkey` FOREIGN KEY (`CountryID`) REFERENCES `Countries`(`CountryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleDetails` ADD CONSTRAINT `VehicleDetails_CountryID_fkey` FOREIGN KEY (`CountryID`) REFERENCES `Countries`(`CountryID`) ON DELETE RESTRICT ON UPDATE CASCADE;
