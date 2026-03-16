import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути к нашим CSV файлам
const CSV_DIR = path.resolve(__dirname, '../../CSV_BD');
const OUTPUT_FILE = path.resolve(__dirname, '../src/assets/data/merged_db.json');

const files = {
    costOfLiving: path.join(CSV_DIR, 'Cost_of_Living_Index_by_Country_2024.csv'),
    qualityOfLife: path.join(CSV_DIR, 'Quality_of_Life.csv')
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
        .replace(/\s*\(.*\)\s*/g, '') // Убираем скобки
        .trim();
}

function parseSpecialFloat(str) {
    if (!str) return null;
    // Находим первое вхождение числа (даже если строка начинается со спецсимволов ': 104.16')
    const match = String(str).match(/[\d.]+/);
    if (match) {
        const val = parseFloat(match[0]);
        // В датасете QoL "0.0" означает отсутствие данных
        return val === 0 ? null : val;
    }
    return null;
}

function buildDatabase() {
    console.log('Building database from CSV files...');

    const colCountries = readCsv(files.costOfLiving);
    const qolCountries = readCsv(files.qualityOfLife);

    // Создаем словарь стран 
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
            localPurchasingPowerIndex: parseFloat(row['Local Purchasing Power Index']) || null
        };
    });

    qolCountries.forEach(row => {
        const rawName = row['country'];
        if (!rawName) return;
        const name = normalizeCountryName(rawName);

        if (!countriesMap[name]) {
            countriesMap[name] = { countryName: rawName };
        }

        // Дополняем данными Quality of life
        countriesMap[name].qualityOfLifeValue = parseSpecialFloat(row['Quality of Life Value']);
        countriesMap[name].safetyValue = parseSpecialFloat(row['Safety Value']);
        countriesMap[name].healthCareValue = parseSpecialFloat(row['Health Care Value']);
        countriesMap[name].climateValue = parseSpecialFloat(row['Climate Value']);
        countriesMap[name].pollutionValue = parseSpecialFloat(row['Pollution Value']);
    });

    // Преобразуем объект в массив и сортируем по алфавиту
    const finalDb = Object.values(countriesMap).sort((a, b) => a.countryName.localeCompare(b.countryName));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalDb, null, 2));
    console.log(`Database built successfully! ${finalDb.length} countries saved to ${OUTPUT_FILE}`);
}

buildDatabase();
