const { chromium } = require('playwright');
const { faker } = require('@faker-js/faker');

const BASE_URL = 'http://localhost:4200';

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const anos = ['2026', '2025', '2024', '2023'];

const tiposInventario = [
  { value: 'electrica', name: 'Energía eléctrica del servicio público' },
  { value: 'renovable', name: 'Energías renovables' },
  { value: 'combustibles', name: 'Energía a partir de combustibles' },
  { value: 'biomasa_electrica', name: 'Biomasa para energía eléctrica' },
  { value: 'biomasa_calor', name: 'Biomasa para generar calor' }
];

const tiposConsumo = [
  { value: 'gas_electrica', name: 'Gas para energía eléctrica' },
  { value: 'gas_calor', name: 'Gas para generar calor' },
  { value: 'vendida', name: 'Energía Vendida' },
  { value: 'recibida', name: 'Energía Recibida' },
  { value: 'cedida', name: 'Energía Cedida' }
];

const empresas = [
  { id: 1, nombre: 'Acme Technologies S.A.' },
  { id: 2, nombre: 'NovaCorp Ltda.' },
  { id: 3, nombre: 'Soluciones Globales' }
];

function obtenerDatosMockInventario(tipo) {
  const datos = {
    mes: faker.helpers.arrayElement(meses),
    ano: faker.helpers.arrayElement(anos)
  };

  switch (tipo) {
    case 'electrica':
      return {
        ...datos,
        cantidad: faker.number.int({ min: 100, max: 5000 }),
        numeroMeses: faker.number.int({ min: 1, max: 12 }),
        costo: faker.number.int({ min: 100000, max: 5000000 })
      };
    case 'renovable':
      return {
        ...datos,
        cantidad: faker.number.int({ min: 50, max: 3000 }),
        numeroMeses: faker.number.int({ min: 1, max: 12 }),
        tipoFuente: faker.helpers.arrayElement(['Solar', 'Eólica', 'Hidráulica', 'Geotérmica'])
      };
    case 'combustibles':
      return {
        ...datos,
        cantidad: faker.number.int({ min: 100, max: 5000 }),
        tipoCombustible: faker.helpers.arrayElement(['Diésel', 'Gas Natural', 'Gasolina', 'Fuel Oil', 'Carbón']),
        cantidadCombustible: faker.number.int({ min: 50, max: 2000 }),
        poderCalorifico: faker.number.int({ min: 1000, max: 50000 })
      };
    case 'biomasa_electrica':
      return {
        ...datos,
        cantidad: faker.number.int({ min: 50, max: 2000 }),
        tipoBiomasa: faker.helpers.arrayElement(['Cascarilla de Arroz', 'Corteza de Árbol', 'Residuos Agrícolas', 'Bagazo de Caña']),
        poderCalorifico: faker.number.int({ min: 500, max: 20000 })
      };
    case 'biomasa_calor':
      return {
        ...datos,
        cantidad: faker.number.int({ min: 50, max: 2000 }),
        tipoBiomasa: faker.helpers.arrayElement(['Cascarilla de Arroz', 'Corteza de Árbol', 'Residuos Agrícolas', 'Bagazo de Caña'])
      };
    default:
      return datos;
  }
}

function obtenerDatosMockConsumo(tipo) {
  const datos = {
    mes: faker.helpers.arrayElement(meses),
    ano: faker.helpers.arrayElement(anos)
  };

  switch (tipo) {
    case 'gas_electrica':
      return {
        ...datos,
        tipoGas: faker.helpers.arrayElement(['Gas Natural', 'GLP', 'Gas de Biogás', 'Gas de Coal', 'Gas Licuado']),
        cantidadGas: faker.number.int({ min: 10, max: 1000 }),
        poderCalorifico: faker.number.int({ min: 100, max: 5000 }),
        unidadKwh: faker.number.int({ min: 50, max: 5000 })
      };
    case 'gas_calor':
      return {
        ...datos,
        tipoGas: faker.helpers.arrayElement(['Gas Natural', 'GLP', 'Gas de Biogás', 'Gas de Coal', 'Gas Licuado']),
        cantidadGas: faker.number.int({ min: 10, max: 1000 })
      };
    case 'vendida':
      return {
        ...datos,
        cantidad: faker.number.int({ min: 100, max: 10000 })
      };
    case 'recibida':
      return {
        ...datos,
        cantidad: faker.number.int({ min: 100, max: 10000 })
      };
    case 'cedida':
      return {
        ...datos,
        cantidad: faker.number.int({ min: 50, max: 5000 })
      };
    default:
      return datos;
  }
}

async function esperarYSeleccionar(page, selector, valor) {
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.selectOption(selector, valor);
}

async function esperarYLlenar(page, selector, valor) {
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.fill(selector, valor.toString());
}

async function llenarFormularioInventario(page, tipo) {
  console.log(`  Llenando formulario: ${tipo.name}`);
  
  const datos = obtenerDatosMockInventario(tipo.value);

  await page.waitForSelector('.filter-select', { timeout: 10000 });
  await page.selectOption('.filter-select', tipo.value);
  
  await page.waitForTimeout(500);

  await page.selectOption('select:has-text("Mes")', datos.mes);
  await page.selectOption('select:has-text("Año")', datos.ano);

  const selects = await page.$$('.form-section select');
  const inputs = await page.$$('.form-section input');

  switch (tipo.value) {
    case 'electrica':
      await page.fill('input[placeholder="0.00"]', datos.cantidad.toString());
      await page.fill('input[placeholder="0"]', datos.numeroMeses.toString());
      await page.fill('input[placeholder="0.00"] >> nth=1', datos.costo.toString());
      break;
    case 'renovable':
      await page.fill('input[placeholder="0.00"]', datos.cantidad.toString());
      await page.fill('input[placeholder="0"]', datos.numeroMeses.toString());
      await page.selectOption('select:has-text("Tipo de Fuente")', datos.tipoFuente);
      break;
    case 'combustibles':
      await page.fill('input[placeholder="0.00"]', datos.cantidad.toString());
      await page.selectOption('select:has-text("Tipo de Combustible")', datos.tipoCombustible);
      await page.fill('input[placeholder="0.00"] >> nth=1', datos.cantidadCombustible.toString());
      await page.fill('input[placeholder="0.00"] >> nth=2', datos.poderCalorifico.toString());
      break;
    case 'biomasa_electrica':
      await page.fill('input[placeholder="0.00"]', datos.cantidad.toString());
      await page.selectOption('select:has-text("Tipo de Biomasa")', datos.tipoBiomasa);
      await page.fill('input[placeholder="0.00"] >> nth=1', datos.poderCalorifico.toString());
      break;
    case 'biomasa_calor':
      await page.fill('input[placeholder="0.00"]', datos.cantidad.toString());
      await page.selectOption('select:has-text("Tipo de Biomasa")', datos.tipoBiomasa);
      break;
  }

  await page.click('button:has-text("Guardar")');
  await page.waitForTimeout(500);
  console.log(`  ✓ Guardado: ${tipo.name}`);
}

async function llenarFormularioConsumo(page, tipo) {
  console.log(`  Llenando formulario: ${tipo.name}`);
  
  const datos = obtenerDatosMockConsumo(tipo.value);

  await page.waitForSelector('.filter-select', { timeout: 10000 });
  await page.selectOption('.filter-select', tipo.value);
  
  await page.waitForTimeout(500);

  await page.selectOption('select:has-text("Mes")', datos.mes);
  await page.selectOption('select:has-text("Año")', datos.ano);

  switch (tipo.value) {
    case 'gas_electrica':
      await page.selectOption('select:has-text("Tipo de Gas")', datos.tipoGas);
      await page.fill('input[placeholder="0.00"]', datos.cantidadGas.toString());
      await page.fill('input[placeholder="0.00"] >> nth=1', datos.poderCalorifico.toString());
      await page.fill('input[placeholder="0.00"] >> nth=2', datos.unidadKwh.toString());
      break;
    case 'gas_calor':
      await page.selectOption('select:has-text("Tipo de Gas")', datos.tipoGas);
      await page.fill('input[placeholder="0.00"]', datos.cantidadGas.toString());
      break;
    case 'vendida':
      await page.fill('input[placeholder="0.00"]', datos.cantidad.toString());
      break;
    case 'recibida':
      await page.fill('input[placeholder="0.00"]', datos.cantidad.toString());
      break;
    case 'cedida':
      await page.fill('input[placeholder="0.00"]', datos.cantidad.toString());
      break;
  }

  await page.click('button:has-text("Guardar")');
  await page.waitForTimeout(500);
  console.log(`  ✓ Guardado: ${tipo.name}`);
}

async function ejecutar() {
  console.log('🚀 Iniciando agente de llenado de formularios...\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`📍 Navegando a ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  
  await page.waitForTimeout(2000);

  let totalRegistros = 0;

  for (const empresa of empresas) {
    console.log(`\n🏢 Empresa: ${empresa.nombre} (ID: ${empresa.id})`);
    console.log('─'.repeat(50));

    console.log('\n📦 Llenando INVENTARIO...');
    await page.goto(`${BASE_URL}/inventario/${empresa.id}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    for (const tipo of tiposInventario) {
      await llenarFormularioInventario(page, tipo);
      totalRegistros++;
    }

    console.log('\n⚡ Llenando CONSUMO...');
    await page.goto(`${BASE_URL}/consumo/${empresa.id}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    for (const tipo of tiposConsumo) {
      await llenarFormularioConsumo(page, tipo);
      totalRegistros++;
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`✅ PROCESO COMPLETADO`);
  console.log(`   Total de registros: ${totalRegistros}`);
  console.log('   Los datos se mostrarán temporalmente en la aplicación.');
  console.log('   Al actualizar la página, los datos desaparecerán.');
  console.log('═'.repeat(50));
  console.log('\n🖥️ El navegador permanecerá abierto para que puedas verificar los datos.');
  console.log('   Presiona Ctrl+C en la terminal para salir.\n');

  await page.waitForTimeout(5000);
  console.log('📌 Ahora puedes revisar la aplicación en el navegador.');
}

ejecutar().catch(console.error);
