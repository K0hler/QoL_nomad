import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути к нашим CSV файлам и данным
const CSV_DIR = path.resolve(__dirname, '../../CSV_BD');
const OUTPUT_FILE = path.resolve(__dirname, '../src/assets/data/merged_db.json');

const files = {
    costOfLiving: path.join(CSV_DIR, 'Cost_of_Living_Index_by_Country_2024.csv'),
    qualityOfLife: path.join(CSV_DIR, 'Quality_of_Life.csv'),
    worldCostOfLiving: path.join(CSV_DIR, 'world_cost_of_living_quality_of_life_2024_2025.csv'),
    supplementary: path.join(CSV_DIR, 'supplementary_data.json')
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

function readJson(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`[WARN] File not found: ${filePath}`);
        return {};
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

function normalizeCountryName(name) {
    if (!name) return '';
    return name.toLowerCase()
        .replace(/\s*\(.*\)\s*/g, '') // Убираем скобки
        .trim();
}

function cleanCategory(str) {
    if (!str) return null;
    // Убираем лишние кавычки из категорий типа "'Very High'"
    return str.replace(/^['"]|['"]$/g, '').trim() || null;
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

function aggregateCityData(rows) {
    // Группируем по стране, предпочитаем 2025 год
    const byCountry = {};

    rows.forEach(row => {
        const country = normalizeCountryName(row['Country']);
        if (!country) return;

        const year = parseInt(row['Year']) || 0;
        if (!byCountry[country]) {
            byCountry[country] = [];
        }
        byCountry[country].push({ ...row, _year: year });
    });

    const result = {};
    for (const [country, cityRows] of Object.entries(byCountry)) {
        // Предпочитаем 2025, fallback на 2024
        const has2025 = cityRows.some(r => r._year === 2025);
        const filtered = has2025
            ? cityRows.filter(r => r._year === 2025)
            : cityRows;

        // Средние значения по городам
        const avg = (field) => {
            const vals = filtered
                .map(r => parseFloat(r[field]))
                .filter(v => !isNaN(v) && v > 0);
            if (vals.length === 0) return null;
            return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
        };

        result[country] = {
            avgInternetCostUsd: avg('Internet_Cost_USD'),
            avgMonthlyRentUsd: avg('Average_Monthly_Rent_USD'),
            avgMonthlySalaryUsd: avg('Average_Monthly_Salary_USD')
        };
    }
    return result;
}

function buildDatabase() {
    console.log('Building database from CSV files...');

    // 1. Cost of Living CSV
    const colCountries = readCsv(files.costOfLiving);
    // 2. Quality of Life CSV
    const qolCountries = readCsv(files.qualityOfLife);
    // 3. World cost of living CSV (city-level)
    const worldCostRows = readCsv(files.worldCostOfLiving);
    const cityAggregated = aggregateCityData(worldCostRows);
    // 4. Supplementary static data
    const supplementary = readJson(files.supplementary);

    // Создаем словарь стран
    const countriesMap = {};

    // Мерж 1: Cost of Living
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

    // Мерж 2: Quality of Life (все 18 колонок)
    qolCountries.forEach(row => {
        const rawName = row['country'];
        if (!rawName) return;
        const name = normalizeCountryName(rawName);

        if (!countriesMap[name]) {
            countriesMap[name] = { countryName: rawName };
        }

        // Существующие поля
        countriesMap[name].qualityOfLifeValue = parseSpecialFloat(row['Quality of Life Value']);
        countriesMap[name].qualityOfLifeCategory = cleanCategory(row['Quality of Life Category']);
        countriesMap[name].safetyValue = parseSpecialFloat(row['Safety Value']);
        countriesMap[name].safetyCategory = cleanCategory(row['Safety Category']);
        countriesMap[name].healthCareValue = parseSpecialFloat(row['Health Care Value']);
        countriesMap[name].healthCareCategory = cleanCategory(row['Health Care Category']);
        countriesMap[name].climateValue = parseSpecialFloat(row['Climate Value']);
        countriesMap[name].climateCategory = cleanCategory(row['Climate Category']);
        countriesMap[name].pollutionValue = parseSpecialFloat(row['Pollution Value']);
        countriesMap[name].pollutionCategory = cleanCategory(row['Pollution Category']);

        // Новые поля (ранее неиспользуемые)
        countriesMap[name].purchasingPowerValue = parseSpecialFloat(row['Purchasing Power Value']);
        countriesMap[name].purchasingPowerCategory = cleanCategory(row['Purchasing Power Category']);
        countriesMap[name].costOfLivingQolValue = parseSpecialFloat(row['Cost of Living Value']);
        countriesMap[name].costOfLivingQolCategory = cleanCategory(row['Cost of Living Category']);
        countriesMap[name].propertyPriceToIncomeValue = parseSpecialFloat(row['Property Price to Income Value']);
        countriesMap[name].propertyPriceToIncomeCategory = cleanCategory(row['Property Price to Income Category']);
        countriesMap[name].trafficCommuteTimeValue = parseSpecialFloat(row['Traffic Commute Time Value']);
        countriesMap[name].trafficCommuteTimeCategory = cleanCategory(row['Traffic Commute Time Category']);
    });

    // Мерж 3: City-level данные (агрегированные по стране)
    for (const [name, data] of Object.entries(cityAggregated)) {
        if (!countriesMap[name]) {
            continue; // Не добавляем страны без основных данных
        }
        Object.assign(countriesMap[name], data);
    }

    // Мерж 4: Supplementary static data
    for (const [name, data] of Object.entries(supplementary)) {
        if (!countriesMap[name]) {
            continue;
        }
        Object.assign(countriesMap[name], data);
    }

    // Преобразуем объект в массив и сортируем по алфавиту
    const finalDb = Object.values(countriesMap).sort((a, b) => a.countryName.localeCompare(b.countryName));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalDb, null, 2));
    console.log(`Database built successfully! ${finalDb.length} countries saved to ${OUTPUT_FILE}`);
}

buildDatabase();
