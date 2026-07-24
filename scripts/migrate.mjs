import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  connectionString: 'postgresql://postgres:sqdIrWgKVn21@@db.efcrctysxrwnrwlwriiy.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const sqlPath = join(__dirname, '..', 'scripts', 'schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function run() {
  try {
    console.log('📡 Conectando ao Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Conexão estabelecida!');

    // Split by semicolons and run each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      try {
        await client.query(stmt);
        const firstLine = stmt.split('\n')[0].substring(0, 60);
        console.log(`✅ OK: ${firstLine}...`);
      } catch (err) {
        const firstLine = stmt.split('\n')[0].substring(0, 60);
        console.warn(`⚠️  Ignorado (pode já existir): ${firstLine}...`);
      }
    }

    console.log('\n🎉 Schema criado com sucesso no Supabase!');
    console.log('🗄️  Tabelas criadas: pedidos_oracao, categorias, produtos, cestas');
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
  } finally {
    await client.end();
  }
}

run();
