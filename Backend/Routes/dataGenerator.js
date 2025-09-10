const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { faker: baseFaker } = require("@faker-js/faker");

const router = express.Router();
const prisma = new PrismaClient();

// Cache for country-specific configurations
const countryConfigCache = new Map();

// Function to set up country-specific faker configurations
function setupFakerForCountry(countryID) {
  // Return cached config if available
  if (countryConfigCache.has(countryID)) {
    return countryConfigCache.get(countryID);
  }

  const countryIDNum = parseInt(countryID);
  let locale = 'en';
  let config = {
    address: {
      postcode: () => baseFaker.location.zipCode(),
      city: () => baseFaker.location.city(),
      streetAddress: () => baseFaker.location.streetAddress()
    },
    phone: {
      number: () => baseFaker.phone.number()
    },
    currencySymbol: '$'
  };

  // Country-specific configurations
  switch (countryIDNum) {
    case 1: // Argentina
      locale = 'es';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(4) + baseFaker.string.alpha({ length: 3, casing: 'upper' }),
          city: () => baseFaker.helpers.arrayElement(['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+54${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '$'
      };
      break;
    case 2: // Australia
      locale = 'en_AU';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(4),
          city: () => baseFaker.location.city(),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+61${baseFaker.string.numeric(9)}`
        },
        currencySymbol: '$'
      };
      break;
    case 3: // Bangladesh
      locale = 'bn';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(4),
          city: () => baseFaker.helpers.arrayElement(['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+880${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '৳'
      };
      break;
    case 4: // Brazil
      locale = 'pt_BR';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5) + '-' + baseFaker.string.numeric(3),
          city: () => baseFaker.helpers.arrayElement(['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+55${baseFaker.string.numeric(10)}`
        },
        currencySymbol: 'R$'
      };
      break;
    case 5: // Canada
      locale = Math.random() > 0.7 ? 'fr_CA' : 'en_CA';
      config = {
        address: {
          postcode: () => {
            const first = baseFaker.string.alpha({ length: 1, casing: 'upper' });
            const second = baseFaker.string.numeric(1);
            const third = baseFaker.string.alpha({ length: 1, casing: 'upper' });
            const fourth = baseFaker.string.numeric(1);
            const fifth = baseFaker.string.alpha({ length: 1, casing: 'upper' });
            const sixth = baseFaker.string.numeric(1);
            return `${first}${second}${third} ${fourth}${fifth}${sixth}`;
          },
          city: () => locale === 'fr_CA' ? 
            baseFaker.helpers.arrayElement(['Montréal', 'Québec', 'Laval', 'Gatineau', 'Sherbrooke']) :
            baseFaker.helpers.arrayElement(['Toronto', 'Vancouver', 'Calgary', 'Ottawa', 'Edmonton']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+1${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '$'
      };
      break;
    case 6: // China
      locale = 'zh_CN';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(6),
          city: () => baseFaker.helpers.arrayElement(['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+86${baseFaker.string.numeric(11)}`
        },
        currencySymbol: '¥'
      };
      break;
    case 7: // Egypt
      locale = 'ar';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5),
          city: () => baseFaker.helpers.arrayElement(['Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+20${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '£'
      };
      break;
    case 8: // France
      locale = 'fr';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5),
          city: () => baseFaker.helpers.arrayElement(['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+33${baseFaker.string.numeric(9)}`
        },
        currencySymbol: '€'
      };
      break;
    case 9: // Germany
      locale = 'de';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5),
          city: () => baseFaker.helpers.arrayElement(['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+49${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '€'
      };
      break;
    case 10: // India
      locale = 'hi';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(6),
          city: () => baseFaker.helpers.arrayElement(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+91${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '₹'
      };
      break;
    case 11: // Italy
      locale = 'it';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5),
          city: () => baseFaker.helpers.arrayElement(['Rome', 'Milan', 'Naples', 'Turin', 'Palermo']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+39${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '€'
      };
      break;
    case 12: // Japan
      locale = 'ja';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(3) + '-' + baseFaker.string.numeric(4),
          city: () => baseFaker.helpers.arrayElement(['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+81${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '¥'
      };
      break;
    case 13: // South Korea
      locale = 'ko';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5),
          city: () => baseFaker.helpers.arrayElement(['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+82${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '₩'
      };
      break;
    case 14: // Mexico
      locale = 'es_MX';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5),
          city: () => baseFaker.helpers.arrayElement(['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+52${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '$'
      };
      break;
    case 15: // Nigeria
      locale = 'en_NG';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(6),
          city: () => baseFaker.helpers.arrayElement(['Lagos', 'Kano', 'Ibadan', 'Abuja', 'Port Harcourt']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+234${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '₦'
      };
      break;
    case 16: // Russia
      locale = 'ru';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(6),
          city: () => baseFaker.helpers.arrayElement(['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+7${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '₽'
      };
      break;
    case 17: // Saudi Arabia
      locale = 'ar';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5),
          city: () => baseFaker.helpers.arrayElement(['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+966${baseFaker.string.numeric(9)}`
        },
        currencySymbol: '﷼'
      };
      break;
    case 18: // United Kingdom
      locale = 'en_GB';
      config = {
        address: {
          postcode: () => {
            const first = baseFaker.string.alpha({ length: 2, casing: 'upper' });
            const second = baseFaker.string.numeric(1);
            const third = baseFaker.string.numeric(1);
            const fourth = baseFaker.string.alpha({ length: 2, casing: 'upper' });
            return `${first}${second} ${third}${fourth}`;
          },
          city: () => baseFaker.helpers.arrayElement(['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+44${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '£'
      };
      break;
    case 19: // United States
      locale = 'en_US';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(5),
          city: () => baseFaker.helpers.arrayElement(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+1${baseFaker.string.numeric(10)}`
        },
        currencySymbol: '$'
      };
      break;
    case 20: // Vietnam
      locale = 'vi';
      config = {
        address: {
          postcode: () => baseFaker.string.numeric(6),
          city: () => baseFaker.helpers.arrayElement(['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho']),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => `+84${baseFaker.string.numeric(9)}`
        },
        currencySymbol: '₫'
      };
      break;
    default:
      // Default configuration for unknown countries
      config = {
        address: {
          postcode: () => baseFaker.location.zipCode(),
          city: () => baseFaker.location.city(),
          streetAddress: () => baseFaker.location.streetAddress()
        },
        phone: {
          number: () => baseFaker.phone.number()
        },
        currencySymbol: '$'
      };
  }

  // Create a new faker instance with the specified locale
  let fakerInstance;
  if (locale === 'en') {
    fakerInstance = baseFaker;
  } else {
    try {
      // Dynamically import the locale-specific faker
      const { faker: localizedFaker } = require(`@faker-js/faker/locale/${locale}`);
      fakerInstance = localizedFaker;
    } catch (err) {
      console.error(`Failed to load locale ${locale}, falling back to English`, err);
      fakerInstance = baseFaker;
    }
  }

  // Cache the configuration
  countryConfigCache.set(countryID, { faker: fakerInstance, config });

  return { faker: fakerInstance, config };
}

// Helper function to generate unique values
async function generateUniqueValues(generatorFn, count, existingValues = new Set()) {
  const values = [];
  const maxAttempts = count * 10;
  let attempts = 0;

  while (values.length < count && attempts < maxAttempts) {
    attempts++;
    const value = await generatorFn();
    if (!existingValues.has(value) && !values.includes(value)) {
      values.push(value);
      existingValues.add(value);
    }
  }

  // If we couldn't generate enough unique values, fill with non-unique values
  while (values.length < count) {
    values.push(await generatorFn());
  }

  return values;
}

// --- PERSONAL DETAILS ---
async function generatePersonalDetails(countryID, count = 10) {
  const { faker, config } = setupFakerForCountry(countryID);
  const personalDetails = [];
  const uniqueIdentifiers = new Set();

  // Country-specific configurations
  const ethnicityOptions = {
    1: ['White', 'Mestizo', 'Indigenous', 'Other'],
    2: ['White', 'Asian', 'Indigenous Australian', 'Other'],
    3: ['Bengali', 'Other'],
    4: ['White', 'Pardo', 'Black', 'Asian', 'Indigenous', 'Other'],
    5: ['White', 'Asian', 'Indigenous', 'Black', 'Other'],
    6: ['Han Chinese', 'Other'],
    7: ['Arab', 'Other'],
    8: ['White', 'North African', 'Black', 'Other'],
    9: ['White', 'Turkish', 'Other'],
    10: ['Indo-Aryan', 'Dravidian', 'Other'],
    11: ['White', 'Other'],
    12: ['Japanese', 'Other'],
    13: ['Korean', 'Other'],
    14: ['Mestizo', 'White', 'Indigenous', 'Other'],
    15: ['Black', 'White', 'Other'],
    16: ['Slavic', 'Tatar', 'Other'],
    17: ['Arab', 'Other'],
    18: ['White', 'Asian', 'Black', 'Other'],
    19: ['White', 'Black', 'Hispanic', 'Asian', 'Other'],
    20: ['Kinh', 'Tay', 'Thai', 'Other']
  };

  const heightRanges = {
    1: [160, 190], 2: [165, 195], 3: [155, 180], 4: [160, 190], 5: [165, 195],
    6: [160, 185], 7: [165, 190], 8: [165, 195], 9: [170, 200], 10: [160, 185],
    11: [165, 190], 12: [160, 185], 13: [165, 190], 14: [160, 185], 15: [165, 195],
    16: [165, 195], 17: [165, 190], 18: [165, 195], 19: [165, 195], 20: [155, 180]
  };

  const weightRanges = {
    1: [50, 100], 2: [55, 110], 3: [45, 85], 4: [50, 100], 5: [55, 110],
    6: [45, 90], 7: [55, 100], 8: [55, 100], 9: [60, 110], 10: [45, 90],
    11: [55, 100], 12: [45, 85], 13: [50, 90], 14: [50, 100], 15: [55, 100],
    16: [55, 110], 17: [55, 100], 18: [55, 110], 19: [55, 120], 20: [45, 85]
  };

  // Country-specific name generators
  const nameGenerators = {
    1: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Juan', 'Carlos', 'José', 'Luis', 'Miguel', 'Alejandro']) : 
        faker.helpers.arrayElement(['María', 'Ana', 'Lucía', 'Sofía', 'Valentina', 'Camila']);
      const lastName = faker.helpers.arrayElement(['Gómez', 'Rodríguez', 'González', 'Fernández', 'López']);
      return `${firstName} ${lastName}`;
    },
    2: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.person.firstName('male') : 
        faker.person.firstName('female');
      const lastName = faker.helpers.arrayElement(['Smith', 'Jones', 'Williams', 'Brown', 'Wilson']);
      return `${firstName} ${lastName}`;
    },
    3: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Mohammad', 'Abdullah', 'Ahmed', 'Hassan', 'Rahim']) : 
        faker.helpers.arrayElement(['Fatima', 'Aisha', 'Jannat', 'Nusrat', 'Rahima']);
      const lastName = faker.helpers.arrayElement(['Ahmed', 'Hossain', 'Rahman', 'Ali', 'Khan']);
      return `${firstName} ${lastName}`;
    },
    4: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['João', 'Pedro', 'Lucas', 'Gabriel', 'Felipe']) : 
        faker.helpers.arrayElement(['Maria', 'Ana', 'Julia', 'Beatriz', 'Laura']);
      const lastName = faker.helpers.arrayElement(['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues']);
      return `${firstName} ${lastName}`;
    },
    5: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.person.firstName('male') : 
        faker.person.firstName('female');
      const lastName = faker.helpers.arrayElement(['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy']);
      return `${firstName} ${lastName}`;
    },
    6: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Wei', 'Jie', 'Yong', 'Lei', 'Feng']) : 
        faker.helpers.arrayElement(['Li', 'Mei', 'Xia', 'Jing', 'Yan']);
      const lastName = faker.helpers.arrayElement(['Wang', 'Li', 'Zhang', 'Liu', 'Chen']);
      return `${lastName} ${firstName}`;
    },
    7: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Mohamed', 'Ahmed', 'Mahmoud', 'Omar', 'Ali']) : 
        faker.helpers.arrayElement(['Fatma', 'Mona', 'Aya', 'Mariam', 'Nour']);
      const lastName = faker.helpers.arrayElement(['Mohamed', 'Ahmed', 'Ali', 'Hassan', 'Mahmoud']);
      return `${firstName} ${lastName}`;
    },
    8: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Jean', 'Pierre', 'Thomas', 'Nicolas', 'François']) : 
        faker.helpers.arrayElement(['Marie', 'Sophie', 'Julie', 'Anne', 'Isabelle']);
      const lastName = faker.helpers.arrayElement(['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert']);
      return `${firstName} ${lastName}`;
    },
    9: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Thomas', 'Michael', 'Andreas', 'Stefan', 'Klaus']) : 
        faker.helpers.arrayElement(['Anna', 'Maria', 'Julia', 'Sophie', 'Laura']);
      const lastName = faker.helpers.arrayElement(['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber']);
      return `${firstName} ${lastName}`;
    },
    10: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Arjun']) : 
        faker.helpers.arrayElement(['Priya', 'Ananya', 'Diya', 'Aanya', 'Ishaan']);
      const lastName = faker.helpers.arrayElement(['Patel', 'Singh', 'Kumar', 'Sharma', 'Gupta']);
      return `${firstName} ${lastName}`;
    },
    11: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Francesco', 'Alessandro', 'Luca', 'Matteo', 'Giovanni']) : 
        faker.helpers.arrayElement(['Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra']);
      const lastName = faker.helpers.arrayElement(['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi']);
      return `${firstName} ${lastName}`;
    },
    12: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Hiroshi', 'Takashi', 'Yuki', 'Haruto', 'Riku']) : 
        faker.helpers.arrayElement(['Yui', 'Aoi', 'Hana', 'Mei', 'Sakura']);
      const lastName = faker.helpers.arrayElement(['Satō', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe']);
      return `${lastName} ${firstName}`;
    },
    13: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Min-jun', 'Seo-joon', 'Ji-hoon', 'Hyun-woo', 'Do-hyun']) : 
        faker.helpers.arrayElement(['Ji-woo', 'Seo-yeon', 'Ji-min', 'Ye-eun', 'Ha-eun']);
      const lastName = faker.helpers.arrayElement(['Kim', 'Lee', 'Park', 'Choi', 'Jung']);
      return `${lastName} ${firstName}`;
    },
    14: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['José', 'Juan', 'Carlos', 'Miguel', 'Luis']) : 
        faker.helpers.arrayElement(['María', 'Guadalupe', 'Ana', 'Rosa', 'Carmen']);
      const lastName = faker.helpers.arrayElement(['Hernández', 'García', 'Martínez', 'López', 'González']);
      return `${firstName} ${lastName}`;
    },
    15: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Adebayo', 'Chinedu', 'Oluwaseun', 'Emeka', 'Obinna']) : 
        faker.helpers.arrayElement(['Amina', 'Chioma', 'Ngozi', 'Aisha', 'Fatima']);
      const lastName = faker.helpers.arrayElement(['Mohammed', 'Okafor', 'Musa', 'Ogunlesi', 'Adebayo']);
      return `${firstName} ${lastName}`;
    },
    16: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Aleksandr', 'Dmitri', 'Mikhail', 'Sergei', 'Ivan']) : 
        faker.helpers.arrayElement(['Anna', 'Maria', 'Elena', 'Olga', 'Natalia']);
      const lastName = faker.helpers.arrayElement(['Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Vasiliev']);
      return `${firstName} ${lastName}`;
    },
    17: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Mohammed', 'Ahmed', 'Abdullah', 'Omar', 'Khalid']) : 
        faker.helpers.arrayElement(['Fatima', 'Aisha', 'Mariam', 'Noura', 'Layla']);
      const lastName = faker.helpers.arrayElement(['Al-Saud', 'Al-Qurashi', 'Al-Otaibi', 'Al-Ghamdi', 'Al-Harbi']);
      return `${firstName} ${lastName}`;
    },
    18: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.person.firstName('male') : 
        faker.person.firstName('female');
      const lastName = faker.helpers.arrayElement(['Smith', 'Jones', 'Taylor', 'Brown', 'Williams']);
      return `${firstName} ${lastName}`;
    },
    19: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.person.firstName('male') : 
        faker.person.firstName('female');
      const lastName = faker.helpers.arrayElement(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones']);
      return `${firstName} ${lastName}`;
    },
    20: (faker, gender) => {
      const firstName = gender === 'male' ? 
        faker.helpers.arrayElement(['Anh', 'Bình', 'Cường', 'Dũng', 'Hải']) : 
        faker.helpers.arrayElement(['Lan', 'Mai', 'Hương', 'Thảo', 'Hà']);
      const lastName = faker.helpers.arrayElement(['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng']);
      return `${lastName} ${firstName}`;
    }
  };

  // Country-specific email generators
  const emailGenerators = {
    1: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.ar', 'outlook.com', 'fibertel.com.ar'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    2: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.au', 'outlook.com', 'bigpond.com'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    3: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'banglalink.net'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}${num}@${domain}`;
    },
    4: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    5: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'hotmail.com', 'yahoo.ca', 'outlook.com', 'sympatico.ca'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    6: (faker, firstName, lastName) => {
      const domains = ['163.com', 'qq.com', 'sina.com', '126.com', 'yeah.net'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${lastName.toLowerCase()}${firstName.toLowerCase()}${num}@${domain}`;
    },
    7: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'link.net'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}${num}@${domain}`;
    },
    8: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'hotmail.fr', 'yahoo.fr', 'outlook.com', 'orange.fr'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    9: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'hotmail.de', 'yahoo.de', 'outlook.com', 'web.de'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    10: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com', 'rediffmail.com'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}${num}@${domain}`;
    },
    11: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'hotmail.it', 'yahoo.it', 'outlook.com', 'libero.it'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    12: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.co.jp', 'hotmail.com', 'outlook.com', 'docomo.ne.jp'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${lastName.toLowerCase()}.${firstName.toLowerCase()}${num}@${domain}`;
    },
    13: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'naver.com', 'daum.net', 'hotmail.com', 'outlook.com'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${lastName.toLowerCase()}${firstName.toLowerCase()}${num}@${domain}`;
    },
    14: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.mx', 'outlook.com', 'prodigy.net.mx'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    15: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mtnonline.net'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}${num}@${domain}`;
    },
    16: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'mail.ru', 'yandex.ru', 'hotmail.com', 'outlook.com'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    17: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'stc.com.sa'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}${num}@${domain}`;
    },
    18: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.co.uk', 'hotmail.co.uk', 'outlook.com', 'btinternet.com'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    19: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
      const domain = faker.helpers.arrayElement(domains);
      const sep = faker.helpers.arrayElement(['.', '_', '']);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${domain}`;
    },
    20: (faker, firstName, lastName) => {
      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'fpt.vn'];
      const domain = faker.helpers.arrayElement(domains);
      const num = faker.number.int({ min: 1, max: 99 });
      return `${lastName.toLowerCase()}${firstName.toLowerCase()}${num}@${domain}`;
    }
  };

  // Generate unique phones and emails first
  const uniquePhones = new Set();
  const uniqueEmails = new Set();

  // Pre-generate unique values
  const phones = await generateUniqueValues(() => config.phone.number(), count, uniquePhones);

  for (let i = 0; i < count; i++) {
    const gender = faker.person.sex();
    const dob = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
    const age = new Date().getFullYear() - dob.getFullYear();
    const ethnicity = faker.helpers.arrayElement(ethnicityOptions[countryID] || ['Asian', 'Black', 'Caucasian', 'Hispanic', 'Mixed', 'Other']);
    
    const heightRange = heightRanges[countryID] || [150, 200];
    const weightRange = weightRanges[countryID] || [50, 120];
    
    // Generate country-specific name
    let fullName;
    let firstName, lastName;
    
    if (nameGenerators[countryID]) {
      fullName = nameGenerators[countryID](faker, gender);
      [firstName, lastName] = fullName.split(' ').length > 1 ? 
        [fullName.split(' ')[0], fullName.split(' ')[1]] : 
        [fullName, ''];
    } else {
      fullName = faker.person.fullName({ sex: gender });
      [firstName, lastName] = fullName.split(' ').length > 1 ? 
        [fullName.split(' ')[0], fullName.split(' ')[1]] : 
        [fullName, ''];
    }

    // Generate realistic email
    let email;
    if (emailGenerators[countryID]) {
      email = emailGenerators[countryID](faker, firstName, lastName);
    } else {
      const domain = faker.internet.domainName();
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.number.int({ min: 1, max: 99 })}@${domain}`;
    }

    // Ensure email is unique
    while (uniqueEmails.has(email)) {
      if (emailGenerators[countryID]) {
        email = emailGenerators[countryID](faker, firstName, lastName);
      } else {
        const domain = faker.internet.domainName();
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.number.int({ min: 1, max: 99 })}@${domain}`;
      }
    }
    uniqueEmails.add(email);

    // Generate unique identifier
    let uniqueIdentifier;
    do {
      uniqueIdentifier = faker.string.alphanumeric(5);
    } while (uniqueIdentifiers.has(uniqueIdentifier));
    uniqueIdentifiers.add(uniqueIdentifier);

    personalDetails.push({
      Name: `${fullName} (#${uniqueIdentifier})`,
      Address: `${config.address.streetAddress()} ${uniqueIdentifier.substring(0, 3)}`,
      Postcode: config.address.postcode(),
      City: config.address.city(),
      DateOfBirth: dob,
      Gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      Phone: phones[i],
      MothersMaidenName: lastName || faker.person.lastName(),
      Email: email,
      Ethnicity: ethnicity,
      ZodiacSign: faker.helpers.arrayElement(["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]),
      Age: age,
      Height: parseFloat((heightRange[0] + Math.random() * (heightRange[1] - heightRange[0])).toFixed(1)),
      Weight: parseFloat((weightRange[0] + Math.random() * (weightRange[1] - weightRange[0])).toFixed(1)),
      EyeColor: faker.helpers.arrayElement(["Brown", "Blue", "Green", "Hazel", "Gray", "Amber"]),
      HairColor: faker.helpers.arrayElement(["Black", "Brown", "Blonde", "Red", "Gray", "White"]),
      CountryID: parseInt(countryID)
    });
  }

  return personalDetails;
}

// --- FINANCIAL DETAILS ---
async function generateFinancialDetails(countryID, count = 10) {
  const { faker, config } = setupFakerForCountry(countryID);
  const financialDetails = [];
  const uniqueCards = new Set();

  // Generate unique credit card numbers first
  const cardTypeMap = {
    'Visa': 'visa',
    'Mastercard': 'mastercard',
    'American Express': 'american_express',
    'Discover': 'discover'
  };
  const cardNumbers = await generateUniqueValues(() => {
    const cardType = faker.helpers.arrayElement(["Visa", "Mastercard", "American Express", "Discover"]);
    const issuer = cardTypeMap[cardType];
    return faker.finance.creditCardNumber(issuer);
  }, count, uniqueCards);

  for (let i = 0; i < count; i++) {
    const cardType = faker.helpers.arrayElement(["Visa", "Mastercard", "American Express", "Discover"]);
    
    financialDetails.push({
      CreditCardType: cardType,
      CreditCardNumber: cardNumbers[i],
      CreditCardExpiry: faker.date.future({ years: 4 }).toISOString().split('T')[0].substring(5),
      CreditCardCVV2: parseInt(faker.finance.creditCardCVV()),
      CountryID: parseInt(countryID)
    });
  }

  return financialDetails;
}

// --- INTERNET DETAILS ---
async function generateInternetDetails(countryID, count = 10) {
  const { faker, config } = setupFakerForCountry(countryID);
  const internetDetails = [];
  const uniqueUserNames = new Set();
  const uniqueIPv4 = new Set();
  const uniqueIPv6 = new Set();

  // Generate unique values first
  const userNames = await generateUniqueValues(() => {
    const firstName = faker.person.firstName().toLowerCase();
    const lastName = faker.person.lastName().toLowerCase();
    const sep = faker.helpers.arrayElement(['', '.', '_']);
    const num = faker.number.int({ min: 1, max: 99 });
    return `${firstName}${sep}${lastName}${num}`;
  }, count, uniqueUserNames);

  const ipv4s = await generateUniqueValues(() => faker.internet.ipv4(), count, uniqueIPv4);
  const ipv6s = await generateUniqueValues(() => faker.internet.ipv6(), count, uniqueIPv6);

  for (let i = 0; i < count; i++) {
    internetDetails.push({
      UserName: userNames[i],
      Password: faker.internet.password({ length: 12, memorable: true }),
      IPv4Address: ipv4s[i],
      IPv6Address: ipv6s[i],
      UserAgent: faker.internet.userAgent(),
      CountryID: parseInt(countryID)
    });
  }

  return internetDetails;
}

// --- EDUCATION DETAILS ---
async function generateEducationDetails(countryID, count = 10) {
  const { faker, config } = setupFakerForCountry(countryID);
  const educationDetails = [];

  // Country-specific common universities
  const commonUniversities = {
    1: ['University of Buenos Aires', 'National University of Córdoba', 'National University of La Plata', 'University of Belgrano', 'Torcuato di Tella University'],
    2: ['University of Sydney', 'University of Melbourne', 'Australian National University', 'University of Queensland', 'University of New South Wales'],
    3: ['University of Dhaka', 'Bangladesh University of Engineering and Technology', 'University of Chittagong', 'Jahangirnagar University', 'North South University'],
    4: ['University of São Paulo', 'University of Campinas', 'Federal University of Rio de Janeiro', 'Federal University of Minas Gerais', 'University of Brasília'],
    5: ['University of Toronto', 'University of British Columbia', 'McGill University', 'University of Alberta', 'McMaster University'],
    6: ['Peking University', 'Tsinghua University', 'Fudan University', 'Zhejiang University', 'Shanghai Jiao Tong University'],
    7: ['Cairo University', 'Ain Shams University', 'Alexandria University', 'American University in Cairo', 'Al-Azhar University'],
    8: ['Sorbonne University', 'PSL University', 'École Polytechnique', 'University of Paris-Saclay', 'École Normale Supérieure de Lyon'],
    9: ['Technical University of Munich', 'Ludwig Maximilian University of Munich', 'Heidelberg University', 'Humboldt University of Berlin', 'University of Bonn'],
    10: ['University of Delhi', 'Indian Institute of Technology Bombay', 'University of Mumbai', 'Jawaharlal Nehru University', 'Banaras Hindu University'],
    11: ['University of Bologna', 'Sapienza University of Rome', 'University of Padua', 'University of Milan', 'University of Pisa'],
    12: ['University of Tokyo', 'Kyoto University', 'Osaka University', 'Tohoku University', 'Nagoya University'],
    13: ['Seoul National University', 'Korea Advanced Institute of Science & Technology', 'Yonsei University', 'Korea University', 'Pohang University of Science and Technology'],
    14: ['National Autonomous University of Mexico', 'Monterrey Institute of Technology', 'Autonomous University of Nuevo León', 'University of Guadalajara', 'Autonomous University of Mexico State'],
    15: ['University of Lagos', 'University of Ibadan', 'Obafemi Awolowo University', 'University of Nigeria', 'Ahmadu Bello University'],
    16: ['Lomonosov Moscow State University', 'Saint Petersburg State University', 'Novosibirsk State University', 'Moscow Institute of Physics and Technology', 'National Research University Higher School of Economics'],
    17: ['King Saud University', 'King Abdulaziz University', 'King Fahd University of Petroleum and Minerals', 'Princess Nourah bint Abdulrahman University', 'Imam Muhammad ibn Saud Islamic University'],
    18: ['University of Oxford', 'University of Cambridge', 'Imperial College London', 'University College London', 'London School of Economics'],
    19: ['Harvard University', 'Stanford University', 'Massachusetts Institute of Technology', 'University of California, Berkeley', 'Yale University'],
    20: ['Vietnam National University, Hanoi', 'Vietnam National University, Ho Chi Minh City', 'Hanoi University of Science and Technology', 'Can Tho University', 'University of Da Nang']
  };

  const qualifications = [
    "High School Diploma", "Associate's Degree", "Bachelor's Degree",
    "Master's Degree", "Doctorate", "Professional Certification"
  ];

  for (let i = 0; i < count; i++) {
    const uniqueIdentifier = faker.string.alphanumeric(5);
    
    // Use country-specific universities if available
    const institution = commonUniversities[countryID] ? 
      `${faker.helpers.arrayElement(commonUniversities[countryID])} #${uniqueIdentifier}` : 
      `${faker.company.name()} University #${uniqueIdentifier}`;
    
    educationDetails.push({
      Qualification: faker.helpers.arrayElement(qualifications),
      Institution: institution,
      CountryID: parseInt(countryID)
    });
  }

  return educationDetails;
}

// --- EMPLOYMENT DETAILS ---
// --- EMPLOYMENT DETAILS ---
async function generateEmploymentDetails(countryID, count = 10) {
  const { faker, config } = setupFakerForCountry(countryID);
  const employmentDetails = [];
  const uniqueCompanyEmails = new Set();

  // Country-specific common companies
  const commonCompanies = {
    1: ['YPF', 'MercadoLibre', 'Grupo Clarín', 'Techint', 'Arcor'],
    2: ['BHP', 'Rio Tinto', 'Commonwealth Bank', 'Telstra', 'Woolworths Group'],
    3: ['Grameenphone', 'BRAC', 'Square Pharmaceuticals', 'Walton Group', 'Beximco'],
    4: ['Petrobras', 'Vale', 'Itaú Unibanco', 'JBS', 'Ambev'],
    5: ['RBC', 'TD Bank', 'Shopify', 'Barrick Gold', 'Thomson Reuters'],
    6: ['Alibaba', 'Tencent', 'Huawei', 'BYD', 'Ping An Insurance'],
    7: ['Orascom', 'EFG Hermes', 'Commercial International Bank', 'El Sewedy Electric', 'Qalaa Holdings'],
    8: ['TotalEnergies', 'LVMH', 'LOréal', 'Airbus', 'BNP Paribas'],
    9: ['Volkswagen', 'Siemens', 'Allianz', 'Deutsche Telekom', 'BASF'],
    10: ['Reliance Industries', 'Tata Consultancy Services', 'HDFC Bank', 'Infosys', 'Bharti Airtel'],
    11: ['Eni', 'Enel', 'Intesa Sanpaolo', 'Poste Italiane', 'UniCredit'],
    12: ['Toyota', 'Sony', 'SoftBank', 'Honda', 'Mitsubishi'],
    13: ['Samsung', 'Hyundai', 'LG', 'SK', 'POSCO'],
    14: ['Pemex', 'América Móvil', 'Grupo Bimbo', 'Cemex', 'Femsa'],
    15: ['Dangote Group', 'MTN Nigeria', 'Zenith Bank', 'Guaranty Trust Bank', 'Access Bank'],
    16: ['Gazprom', 'Rosneft', 'Sberbank', 'Lukoil', 'Russian Railways'],
    17: ['Saudi Aramco', 'SABIC', 'Al Rajhi Bank', 'Saudi Telecom Company', 'National Commercial Bank'],
    18: ['HSBC', 'BP', 'GlaxoSmithKline', 'Unilever', 'Lloyds Banking Group'],
    19: ['Apple', 'Amazon', 'Microsoft', 'Alphabet', 'Berkshire Hathaway'],
    20: ['Viettel', 'VinGroup', 'PetroVietnam', 'Vietcombank', 'Sabeco']
  };

  // Generate salary based on country's average
  const salaryRanges = {
    1: [30000, 120000], 2: [50000, 150000], 3: [10000, 60000], 4: [20000, 100000], 5: [40000, 140000],
    6: [15000, 80000], 7: [12000, 70000], 8: [35000, 120000], 9: [40000, 130000], 10: [10000, 70000],
    11: [25000, 100000], 12: [30000, 110000], 13: [25000, 100000], 14: [15000, 80000], 15: [8000, 60000],
    16: [20000, 90000], 17: [25000, 120000], 18: [30000, 130000], 19: [35000, 150000], 20: [10000, 60000]
  };

  // Generate unique company emails first
  const companyEmails = await generateUniqueValues(() => {
    const companyName = commonCompanies[countryID] ? 
      faker.helpers.arrayElement(commonCompanies[countryID]) : 
      faker.company.name();
    const domain = faker.internet.domainName();
    return `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.${domain.split('.')[1] || 'com'}`;
  }, count, uniqueCompanyEmails);

  // List of common job titles
  const jobTitles = [
    'Account Manager', 'Business Analyst', 'CEO', 'CFO', 'CTO',
    'Customer Support', 'Data Analyst', 'Developer', 'Director',
    'Engineer', 'Executive Assistant', 'HR Manager', 'IT Specialist',
    'Manager', 'Marketing Specialist', 'Operations Manager',
    'Product Manager', 'Project Manager', 'Sales Representative',
    'Software Engineer', 'Team Lead', 'UX Designer'
  ];

  for (let i = 0; i < count; i++) {
    const uniqueIdentifier = faker.string.alphanumeric(5);
    const companyName = commonCompanies[countryID] ? 
      `${faker.helpers.arrayElement(commonCompanies[countryID])} #${uniqueIdentifier}` : 
      `${faker.company.name()} #${uniqueIdentifier}`;
    
    const salaryRange = salaryRanges[countryID] || [30000, 100000];
    const salary = faker.finance.amount({ 
      min: salaryRange[0], 
      max: salaryRange[1], 
      dec: 0, 
      symbol: config.currencySymbol 
    });

    employmentDetails.push({
      CompanyName: companyName,
      Salary: salary,
      CompanyAddress: `${config.address.streetAddress()}, ${config.address.city()} ${uniqueIdentifier}`,
      JobTitle: faker.helpers.arrayElement(jobTitles), // Fixed: using our predefined array
      CompanyPhone: config.phone.number(),
      CompanyEmail: companyEmails[i],
      CountryID: parseInt(countryID)
    });
  }

  return employmentDetails;
}

// --- VEHICLE DETAILS ---
async function generateVehicleDetails(countryID, count = 10) {
  const { faker, config } = setupFakerForCountry(countryID);
  const vehicleDetails = [];
  const uniquePlates = new Set();
  const uniqueVINs = new Set();

  // Country-specific common vehicle brands
  const commonVehicleBrands = {
    1: ['Toyota', 'Volkswagen', 'Chevrolet', 'Ford', 'Fiat'],
    2: ['Toyota', 'Mazda', 'Hyundai', 'Ford', 'Mitsubishi'],
    3: ['Toyota', 'Nissan', 'Mitsubishi', 'Honda', 'Suzuki'],
    4: ['Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Hyundai'],
    5: ['Ford', 'Toyota', 'Honda', 'Chevrolet', 'Hyundai'],
    6: ['Volkswagen', 'Toyota', 'Honda', 'Buick', 'Hyundai'],
    7: ['Toyota', 'Hyundai', 'Kia', 'Chevrolet', 'Nissan'],
    8: ['Peugeot', 'Renault', 'Citroën', 'Volkswagen', 'Toyota'],
    9: ['Volkswagen', 'Mercedes-Benz', 'BMW', 'Audi', 'Opel'],
    10: ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda'],
    11: ['Fiat', 'Alfa Romeo', 'Lancia', 'Ferrari', 'Lamborghini'],
    12: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mazda'],
    13: ['Hyundai', 'Kia', 'SsangYong', 'Renault Samsung', 'Chevrolet'],
    14: ['Nissan', 'Volkswagen', 'General Motors', 'Toyota', 'Kia'],
    15: ['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia'],
    16: ['Lada', 'GAZ', 'UAZ', 'KAMAZ', 'Volkswagen'],
    17: ['Toyota', 'Hyundai', 'Nissan', 'Kia', 'Mitsubishi'],
    18: ['Ford', 'Vauxhall', 'Volkswagen', 'BMW', 'Mercedes-Benz'],
    19: ['Ford', 'Chevrolet', 'Toyota', 'Honda', 'Nissan'],
    20: ['Toyota', 'Honda', 'Ford', 'Hyundai', 'Kia']
  };

  // Generate unique plates and VINs first
  const plates = await generateUniqueValues(() => {
    const uniquePart = faker.string.alphanumeric(6);
    return uniquePart + faker.vehicle.vrm().substring(6);
  }, count, uniquePlates);

  const vins = await generateUniqueValues(() => {
    const uniquePart = faker.string.alphanumeric(6);
    return uniquePart + faker.vehicle.vin().substring(6);
  }, count, uniqueVINs);

  for (let i = 0; i < count; i++) {
    const uniqueIdentifier = faker.string.alphanumeric(5);
    const brand = commonVehicleBrands[countryID] ? 
      faker.helpers.arrayElement(commonVehicleBrands[countryID]) : 
      faker.vehicle.manufacturer();
    
    const model = faker.vehicle.model();

    vehicleDetails.push({
      VehicleName: `${brand} ${model} #${uniqueIdentifier}`,
      LicensePlate: plates[i],
      VIN: vins[i],
      Color: faker.vehicle.color(),
      CountryID: parseInt(countryID)
    });
  }

  return vehicleDetails;
}

// --- FETCH DATA ENDPOINTS ---

// Helper for pagination
function getPagination(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

// Fetch personal details by country
router.get('/api/personal/:countryID', async (req, res) => {
  const { countryID } = req.params;
  const { skip, take } = getPagination(req);
  
  try {
    // Check if data exists
    const existingCount = await prisma.personalDetails.count({
      where: { CountryID: parseInt(countryID) }
    });
    
    if (existingCount === 0) {
      // Generate data if not exists
      await generatePersonalDetails(countryID, 30);
    }
    
    const data = await prisma.personalDetails.findMany({
      where: { CountryID: parseInt(countryID) },
      skip,
      take,
      orderBy: { ID: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching personal details:', error);
    res.status(500).json({ error: 'Failed to fetch personal details', details: error.message });
  }
});

// Fetch financial details by country
router.get('/api/financial/:countryID', async (req, res) => {
  const { countryID } = req.params;
  const { skip, take } = getPagination(req);
  
  try {
    // Check if data exists
    const existingCount = await prisma.financialDetails.count({
      where: { CountryID: parseInt(countryID) }
    });
    
    if (existingCount === 0) {
      // Generate data if not exists
      await generateFinancialDetails(countryID, 30);
    }
    
    const data = await prisma.financialDetails.findMany({
      where: { CountryID: parseInt(countryID) },
      skip,
      take,
      orderBy: { ID: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching financial details:', error);
    res.status(500).json({ error: 'Failed to fetch financial details', details: error.message });
  }
});

// Fetch internet details by country
router.get('/api/internet/:countryID', async (req, res) => {
  const { countryID } = req.params;
  const { skip, take } = getPagination(req);
  
  try {
    // Check if data exists
    const existingCount = await prisma.internetDetails.count({
      where: { CountryID: parseInt(countryID) }
    });
    
    if (existingCount === 0) {
      // Generate data if not exists
      await generateInternetDetails(countryID, 30);
    }
    
    const data = await prisma.internetDetails.findMany({
      where: { CountryID: parseInt(countryID) },
      skip,
      take,
      orderBy: { ID: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching internet details:', error);
    res.status(500).json({ error: 'Failed to fetch internet details', details: error.message });
  }
});

// Fetch education details by country
router.get('/api/education/:countryID', async (req, res) => {
  const { countryID } = req.params;
  const { skip, take } = getPagination(req);
  
  try {
    // Check if data exists
    const existingCount = await prisma.educationDetails.count({
      where: { CountryID: parseInt(countryID) }
    });
    
    if (existingCount === 0) {
      // Generate data if not exists
      await generateEducationDetails(countryID, 30);
    }
    
    const data = await prisma.educationDetails.findMany({
      where: { CountryID: parseInt(countryID) },
      skip,
      take,
      orderBy: { ID: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching education details:', error);
    res.status(500).json({ error: 'Failed to fetch education details', details: error.message });
  }
});

// Fetch employment details by country
router.get('/api/employment/:countryID', async (req, res) => {
  const { countryID } = req.params;
  const { skip, take } = getPagination(req);
  
  try {
    // Check if data exists
    const existingCount = await prisma.employmentDetails.count({
      where: { CountryID: parseInt(countryID) }
    });
    
    if (existingCount === 0) {
      // Generate data if not exists
      await generateEmploymentDetails(countryID, 30);
    }
    
    const data = await prisma.employmentDetails.findMany({
      where: { CountryID: parseInt(countryID) },
      skip,
      take,
      orderBy: { ID: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching employment details:', error);
    res.status(500).json({ error: 'Failed to fetch employment details', details: error.message });
  }
});

// Fetch vehicle details by country
router.get('/api/vehicle/:countryID', async (req, res) => {
  const { countryID } = req.params;
  const { skip, take } = getPagination(req);
  
  try {
    // Check if data exists
    const existingCount = await prisma.vehicleDetails.count({
      where: { CountryID: parseInt(countryID) }
    });
    
    if (existingCount === 0) {
      // Generate data if not exists
      await generateVehicleDetails(countryID, 30);
    }
    
    const data = await prisma.vehicleDetails.findMany({
      where: { CountryID: parseInt(countryID) },
      skip,
      take,
      orderBy: { ID: 'asc' }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle details', details: error.message });
  }
});

// Route to check if data exists for a country
router.get('/check/:countryID', async (req, res) => {
  const { countryID } = req.params;
  
  try {
    const personalCount = await prisma.personalDetails.count({
      where: { CountryID: parseInt(countryID) }
    });
    
    res.json({
      countryID,
      hasData: personalCount > 0,
      count: personalCount
    });
  } catch (error) {
    console.error('Error checking data:', error);
    res.status(500).json({ error: 'Failed to check data', details: error.message });
  }
});

// Route to generate data for a country
router.post('/generate/:countryID', async (req, res) => {
  const { countryID } = req.params;
  let { count = 30 } = req.body;
  count = Math.max(count, 30);
  
  try {
    // Check if the country exists
    const country = await prisma.countries.findUnique({
      where: { CountryID: parseInt(countryID) }
    });
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Generate all data in parallel
    const [
      personalDetails,
      financialDetails,
      internetDetails,
      educationDetails,
      employmentDetails,
      vehicleDetails
    ] = await Promise.all([
      generatePersonalDetails(countryID, count),
      generateFinancialDetails(countryID, count),
      generateInternetDetails(countryID, count),
      generateEducationDetails(countryID, count),
      generateEmploymentDetails(countryID, count),
      generateVehicleDetails(countryID, count)
    ]);

    // Use transactions to ensure all data is inserted or none
    const result = await prisma.$transaction(async (prisma) => {
      const personalCreated = await prisma.personalDetails.createMany({ 
        data: personalDetails,
        skipDuplicates: true 
      });
      
      const financialCreated = await prisma.financialDetails.createMany({ 
        data: financialDetails,
        skipDuplicates: true 
      });
      
      const internetCreated = await prisma.internetDetails.createMany({ 
        data: internetDetails,
        skipDuplicates: true 
      });
      
      const educationCreated = await prisma.educationDetails.createMany({ 
        data: educationDetails,
        skipDuplicates: true 
      });
      
      const employmentCreated = await prisma.employmentDetails.createMany({ 
        data: employmentDetails,
        skipDuplicates: true 
      });
      
      const vehicleCreated = await prisma.vehicleDetails.createMany({ 
        data: vehicleDetails,
        skipDuplicates: true 
      });

      return {
        personal: personalCreated.count,
        financial: financialCreated.count,
        internet: internetCreated.count,
        education: educationCreated.count,
        employment: employmentCreated.count,
        vehicle: vehicleCreated.count
      };
    });

    res.status(201).json({
      message: 'Data generated successfully',
      counts: result
    });
  } catch (error) {
    console.error('Error generating data:', error);
    res.status(500).json({ 
      error: 'Failed to generate data', 
      details: error.message 
    });
  }
});

// Route to generate data for all countries
router.post('/generate-all', async (req, res) => {
  let { count = 60 } = req.body;
  count = Math.max(count, 60);
  
  try {
    const countries = await prisma.countries.findMany();
    const results = [];
    
    // Process countries sequentially to avoid overwhelming the database
    for (const country of countries) {
      try {
        const countryID = country.CountryID;
        
        // Generate all data in parallel
        const [
          personalDetails,
          financialDetails,
          internetDetails,
          educationDetails,
          employmentDetails,
          vehicleDetails
        ] = await Promise.all([
          generatePersonalDetails(countryID, count),
          generateFinancialDetails(countryID, count),
          generateInternetDetails(countryID, count),
          generateEducationDetails(countryID, count),
          generateEmploymentDetails(countryID, count),
          generateVehicleDetails(countryID, count)
        ]);

        // Use transaction for each country
        const result = await prisma.$transaction(async (prisma) => {
          const personalCreated = await prisma.personalDetails.createMany({ 
            data: personalDetails,
            skipDuplicates: true 
          });
          
          const financialCreated = await prisma.financialDetails.createMany({ 
            data: financialDetails,
            skipDuplicates: true 
          });
          
          const internetCreated = await prisma.internetDetails.createMany({ 
            data: internetDetails,
            skipDuplicates: true 
          });
          
          const educationCreated = await prisma.educationDetails.createMany({ 
            data: educationDetails,
            skipDuplicates: true 
          });
          
          const employmentCreated = await prisma.employmentDetails.createMany({ 
            data: employmentDetails,
            skipDuplicates: true 
          });
          
          const vehicleCreated = await prisma.vehicleDetails.createMany({ 
            data: vehicleDetails,
            skipDuplicates: true 
          });

          return {
            personal: personalCreated.count,
            financial: financialCreated.count,
            internet: internetCreated.count,
            education: educationCreated.count,
            employment: employmentCreated.count,
            vehicle: vehicleCreated.count
          };
        });

        results.push({
          countryID,
          countryName: country.CountryName,
          success: true,
          counts: result
        });
      } catch (err) {
        console.error(`Error generating data for country ${country.CountryID}:`, err);
        results.push({
          countryID: country.CountryID,
          countryName: country.CountryName,
          success: false,
          error: err.message
        });
      }
    }
    
    res.status(201).json({ 
      message: 'Data generation for all countries complete', 
      results 
    });
  } catch (error) {
    console.error('Error generating data for all countries:', error);
    res.status(500).json({ 
      error: 'Failed to generate data for all countries', 
      details: error.message 
    });
  }
});

module.exports = router;