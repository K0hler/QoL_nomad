import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути к нашим CSV файлам (ожидается, что они лежат в папке CSV_BD уровнем выше)
const CSV_DIR = path.resolve(__dirname, '../../CSV_BD');
const OUTPUT_FILE = path.resolve(__dirname, '../src/assets/data/merged_db.json');

const files = {
    costOfLiving: path.join(CSV_DIR, 'Cost_of_Living_Index_by_Country_2024.csv'),
    qualityOfLife: path.join(CSV_DIR, 'Quality_of_Life.csv'),
    citiesData: path.join(CSV_DIR, 'world_cost_of_living_quality_of_life_2024_2025.csv'),
};

function readCsv(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`[WARN] File not found: ${filePath}`);
        return [];
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
}

function normalizeCountryName(name) {
    if (!name) return '';
    return name.toLowerCase()
        .replace(/\s*\(.*\)\s*/g, '') // Убираем скобки: "Hong Kong (China)" -> "hong kong"
        .trim();
}

function buildDatabase() {
    console.log('Building database from CSV files...');

    const colCountries = readCsv(files.costOfLiving);
    const qolCountries = readCsv(files.qualityOfLife);
    const citiesData = readCsv(files.citiesData);

    // Создаем словарь стран для быстрого доступа
    const countriesMap = {};

    colCountries.forEach(row => {
        const rawName = row['Country'];
        if (!rawName) return;
        const name = normalizeCountryName(rawName);

        countriesMap[name] = {
            countryName: rawName,
            costOfLivingIndex: parseFloat(row['Cost of Living Index']) || null,
            rentIndex: parseFloat(row['Rent Index']) || null,
            groceriesIndex: parseFloat(row['Groceries Index']) || null,
            restaurantPriceIndex: parseFloat(row['Restaurant Price Index']) || null,
            localPurchasingPowerIndex: parseFloat(row['Local Purchasing Power Index']) || null,
            cities: []
        };
    });

    qolCountries.forEach(row => {
        const rawName = row['country'];
        if (!rawName) return;
        const name = normalizeCountryName(rawName);

        if (!countriesMap[name]) {
            countriesMap[name] = { countryName: rawName, cities: [] };
        }

        // Дополняем данными Quality of life
        countriesMap[name].qualityOfLifeValue = parseFloat(row['Quality of Life Value']) || null;
        countriesMap[name].safetyValue = parseFloat(row['Safety Value']) || null;
        countriesMap[name].healthCareValue = parseFloat(row['Health Care Value']) || null;
        countriesMap[name].climateValue = parseFloat(row['Climate Value']) || null;
        countriesMap[name].pollutionValue = parseFloat(row['Pollution Value']) || null;
    });

    // Применяем данные по городам к странам
    citiesData.forEach(row => {
        // В world_cost_of_living... года 2024-2025 лежат в разных строках. Оставим только свежие (2025)
        if (row['Year'] !== '2025') return;

        const countryName = normalizeCountryName(row['Country']);

        const cityObj = {
            name: row['City'],
            rentUSD: parseFloat(row['Average_Monthly_Rent_USD']) || null,
            salaryUSD: parseFloat(row['Average_Monthly_Salary_USD']) || null,
            internetCostUSD: parseFloat(row['Internet_Cost_USD']) || null,
            foodCostIndex: parseFloat(row['Food_Cost_Index']) || null,
            qolIndex: parseFloat(row['Quality_of_Life_Index']) || null,
        };

        if (countriesMap[countryName]) {
            countriesMap[countryName].cities.push(cityObj);
        } else {
            countriesMap[countryName] = {
                countryName: row['Country'],
                cities: [cityObj]
            };
        }
    });

    // Преобразуем объект в массив и сортируем (например, по алфавиту)
    const finalDb = Object.values(countriesMap).sort((a, b) => a.countryName.localeCompare(b.countryName));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalDb, null, 2));
    console.log(`Database built successfully! ${finalDb.length} countries saved to ${OUTPUT_FILE}`);
}

buildDatabase();
