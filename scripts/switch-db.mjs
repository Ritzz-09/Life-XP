import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const targetProvider = process.argv[2]; // 'postgresql' or 'sqlite'

if (!['postgresql', 'sqlite'].includes(targetProvider)) {
  console.error('Usage: node switch-db.mjs [postgresql|sqlite]');
  process.exit(1);
}

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (targetProvider === 'postgresql') {
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log('Switched Prisma provider to: postgresql (Neon / Supabase / Railway)');
} else {
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log('Switched Prisma provider to: sqlite (Local dev.db)');
}

fs.writeFileSync(schemaPath, schema);

console.log('Running prisma generate...');
execSync('npx prisma generate', { stdio: 'inherit' });
console.log('SUCCESS: Database provider switched and Prisma client regenerated.');
