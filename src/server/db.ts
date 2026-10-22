import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PUBLICATIONS } from '../data/initialPublications.ts';
import { FLAGSHIP_PROGRAMS } from '../data/flagshipPrograms.ts';
import { INITIAL_INSTAGRAM_PHOTOS, InstagramPhotoItem } from '../data/initialInstagramPhotos.ts';
import { Publication } from '../types/publication.ts';
import { FlagshipProgram } from '../types/program.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const JSON_DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseState {
  seeded: boolean;
  publications: Publication[];
  programs: FlagshipProgram[];
  categories: string[];
  instagramPhotos: InstagramPhotoItem[];
}

let pgPool: Pool | null = null;
let isPostgresActive = false;

// Initialize PostgreSQL Pool if credentials exist
export async function initPostgres(): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL;
  const host = process.env.PGHOST || process.env.SQL_HOST;
  const user = process.env.PGUSER || process.env.SQL_USER;

  if (connectionString || (host && user)) {
    try {
      pgPool = new Pool(
        connectionString
          ? { connectionString, connectionTimeoutMillis: 4000 }
          : {
              host,
              user,
              password: process.env.PGPASSWORD || process.env.SQL_PASSWORD,
              database: process.env.PGDATABASE || process.env.SQL_DB_NAME || 'wartakarsa_db',
              port: parseInt(process.env.PGPORT || '5432', 10),
              connectionTimeoutMillis: 4000,
            }
      );

      // Test connection
      const client = await pgPool.connect();
      try {
        await client.query('SELECT 1');
        isPostgresActive = true;
        console.log('✅ PostgreSQL connected successfully!');
        await setupPostgresSchema(client);
        return true;
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.warn('⚠️ PostgreSQL connection failed, falling back to persistent file store:', err.message);
      isPostgresActive = false;
      return false;
    }
  }
  return false;
}

async function setupPostgresSchema(client: any) {
  // Read and apply schema
  const schemaPath = path.resolve(__dirname, '../../schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schemaSql);
  }

  // Check if system has been seeded before
  const res = await client.query("SELECT value FROM system_meta WHERE key = 'seeded'");
  if (res.rows.length === 0) {
    console.log('🌱 First-time PostgreSQL initialization: Seeding initial data...');

    // Seed default categories
    const defaultCategories = [
      'Pendidikan & Pelatihan',
      'Bakti Sosial & Lingkungan',
      'Seminar & Riset',
      'Ekspedisi & Lapangan',
      'Organisasi & Tata Kelola'
    ];
    for (const cat of defaultCategories) {
      await client.query('INSERT INTO program_categories (name) VALUES ($1) ON CONFLICT DO NOTHING', [cat]);
    }

    // Seed default programs
    for (const p of FLAGSHIP_PROGRAMS) {
      await client.query(
        `INSERT INTO flagship_programs (id, code, title, category, data)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.code, p.title, p.category, JSON.stringify(p)]
      );
    }

    // Seed default publications
    for (const pub of INITIAL_PUBLICATIONS) {
      await client.query(
        `INSERT INTO publications (id, title, category, status, date, data)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [pub.id, pub.title, pub.category, pub.status, pub.date, JSON.stringify(pub)]
      );
    }

    // Seed default instagram photos
    for (const photo of INITIAL_INSTAGRAM_PHOTOS) {
      await client.query(
        `INSERT INTO instagram_photos (id, title, category, date, data)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
        [photo.id, photo.title, photo.category, photo.date, JSON.stringify(photo)]
      );
    }

    // Mark as seeded permanently!
    await client.query("INSERT INTO system_meta (key, value) VALUES ('seeded', 'true')");
    console.log('✅ Initial data seeded into PostgreSQL. User deletions and edits are permanent!');
  } else {
    console.log('ℹ️ Database was previously initialized. Preserving all user deletions and edits.');
  }
}

// -----------------------------------------------------------------------------
// File-based Storage (Persistent Fallback)
// -----------------------------------------------------------------------------
function readJsonDb(): DatabaseState {
  if (!fs.existsSync(JSON_DB_FILE)) {
    const initialState: DatabaseState = {
      seeded: true,
      publications: INITIAL_PUBLICATIONS,
      programs: FLAGSHIP_PROGRAMS,
      categories: [
        'Pendidikan & Pelatihan',
        'Bakti Sosial & Lingkungan',
        'Seminar & Riset',
        'Ekspedisi & Lapangan',
        'Organisasi & Tata Kelola'
      ],
      instagramPhotos: INITIAL_INSTAGRAM_PHOTOS,
    };
    fs.writeFileSync(JSON_DB_FILE, JSON.stringify(initialState, null, 2), 'utf-8');
    return initialState;
  }

  try {
    const content = fs.readFileSync(JSON_DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (parsed && parsed.seeded === true) {
      return {
        seeded: true,
        publications: parsed.publications || [],
        programs: parsed.programs || [],
        categories: parsed.categories || [],
        instagramPhotos: parsed.instagramPhotos || [],
      };
    }
  } catch (e) {
    console.error('Error reading JSON DB:', e);
  }

  const fresh: DatabaseState = {
    seeded: true,
    publications: INITIAL_PUBLICATIONS,
    programs: FLAGSHIP_PROGRAMS,
    categories: [
      'Pendidikan & Pelatihan',
      'Bakti Sosial & Lingkungan',
      'Seminar & Riset',
      'Ekspedisi & Lapangan',
      'Organisasi & Tata Kelola'
    ],
    instagramPhotos: INITIAL_INSTAGRAM_PHOTOS,
  };
  fs.writeFileSync(JSON_DB_FILE, JSON.stringify(fresh, null, 2), 'utf-8');
  return fresh;
}

function writeJsonDb(data: Partial<DatabaseState>) {
  const current = readJsonDb();
  const updated: DatabaseState = {
    ...current,
    ...data,
    seeded: true,
  };
  fs.writeFileSync(JSON_DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// -----------------------------------------------------------------------------
// Database Operations (Dual Engine)
// -----------------------------------------------------------------------------

export async function getDbStatus() {
  return {
    engine: isPostgresActive ? 'PostgreSQL' : 'Persistent File Storage (PostgreSQL Ready)',
    isPostgres: isPostgresActive,
    storageLocation: isPostgresActive
      ? (process.env.DATABASE_URL ? 'PostgreSQL Database' : 'Cloud/Local PostgreSQL')
      : JSON_DB_FILE,
  };
}

// Publications
export async function getAllPublications(): Promise<Publication[]> {
  if (isPostgresActive && pgPool) {
    const res = await pgPool.query('SELECT data FROM publications ORDER BY date DESC, created_at DESC');
    return res.rows.map(row => typeof row.data === 'string' ? JSON.parse(row.data) : row.data);
  }
  return readJsonDb().publications;
}

export async function upsertPublication(pub: Publication): Promise<Publication> {
  if (isPostgresActive && pgPool) {
    const query = `
      INSERT INTO publications (id, title, category, status, date, data, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        status = EXCLUDED.status,
        date = EXCLUDED.date,
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    await pgPool.query(query, [
      pub.id, pub.title, pub.category, pub.status, pub.date, JSON.stringify(pub)
    ]);
    return pub;
  }

  const db = readJsonDb();
  const index = db.publications.findIndex(p => p.id === pub.id);
  if (index >= 0) {
    db.publications[index] = pub;
  } else {
    db.publications.unshift(pub);
  }
  writeJsonDb({ publications: db.publications });
  return pub;
}

export async function deletePublicationById(id: string): Promise<boolean> {
  if (isPostgresActive && pgPool) {
    const res = await pgPool.query('DELETE FROM publications WHERE id = $1', [id]);
    return (res.rowCount || 0) > 0;
  }

  const db = readJsonDb();
  const filtered = db.publications.filter(p => p.id !== id);
  writeJsonDb({ publications: filtered });
  return true;
}

// Programs
export async function getAllPrograms(): Promise<FlagshipProgram[]> {
  if (isPostgresActive && pgPool) {
    const res = await pgPool.query('SELECT data FROM flagship_programs ORDER BY created_at ASC');
    return res.rows.map(row => typeof row.data === 'string' ? JSON.parse(row.data) : row.data);
  }
  return readJsonDb().programs;
}

export async function upsertProgram(prog: FlagshipProgram): Promise<FlagshipProgram> {
  if (isPostgresActive && pgPool) {
    const query = `
      INSERT INTO flagship_programs (id, code, title, category, data, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        code = EXCLUDED.code,
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    await pgPool.query(query, [
      prog.id, prog.code, prog.title, prog.category, JSON.stringify(prog)
    ]);
    return prog;
  }

  const db = readJsonDb();
  const index = db.programs.findIndex(p => p.id === prog.id);
  if (index >= 0) {
    db.programs[index] = prog;
  } else {
    db.programs.push(prog);
  }
  writeJsonDb({ programs: db.programs });
  return prog;
}

export async function deleteProgramById(id: string): Promise<boolean> {
  if (isPostgresActive && pgPool) {
    const res = await pgPool.query('DELETE FROM flagship_programs WHERE id = $1', [id]);
    return (res.rowCount || 0) > 0;
  }

  const db = readJsonDb();
  const filtered = db.programs.filter(p => p.id !== id);
  writeJsonDb({ programs: filtered });
  return true;
}

// Categories
export async function getAllCategories(): Promise<string[]> {
  if (isPostgresActive && pgPool) {
    const res = await pgPool.query('SELECT name FROM program_categories ORDER BY created_at ASC');
    return res.rows.map(r => r.name);
  }
  return readJsonDb().categories;
}

export async function saveCategoriesList(categories: string[]): Promise<string[]> {
  if (isPostgresActive && pgPool) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM program_categories');
      for (const cat of categories) {
        await client.query('INSERT INTO program_categories (name) VALUES ($1) ON CONFLICT DO NOTHING', [cat]);
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    return categories;
  }

  writeJsonDb({ categories });
  return categories;
}

// Instagram Photos
export async function getAllInstagramPhotos(): Promise<InstagramPhotoItem[]> {
  if (isPostgresActive && pgPool) {
    const res = await pgPool.query('SELECT data FROM instagram_photos ORDER BY date DESC, created_at DESC');
    return res.rows.map(row => typeof row.data === 'string' ? JSON.parse(row.data) : row.data);
  }
  return readJsonDb().instagramPhotos;
}

export async function upsertInstagramPhoto(photo: InstagramPhotoItem): Promise<InstagramPhotoItem> {
  if (isPostgresActive && pgPool) {
    const query = `
      INSERT INTO instagram_photos (id, title, category, date, data, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        date = EXCLUDED.date,
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    await pgPool.query(query, [
      photo.id, photo.title, photo.category, photo.date, JSON.stringify(photo)
    ]);
    return photo;
  }

  const db = readJsonDb();
  const index = db.instagramPhotos.findIndex(p => p.id === photo.id);
  if (index >= 0) {
    db.instagramPhotos[index] = photo;
  } else {
    db.instagramPhotos.unshift(photo);
  }
  writeJsonDb({ instagramPhotos: db.instagramPhotos });
  return photo;
}

export async function deleteInstagramPhotoById(id: string): Promise<boolean> {
  if (isPostgresActive && pgPool) {
    const res = await pgPool.query('DELETE FROM instagram_photos WHERE id = $1', [id]);
    return (res.rowCount || 0) > 0;
  }

  const db = readJsonDb();
  const filtered = db.instagramPhotos.filter(p => p.id !== id);
  writeJsonDb({ instagramPhotos: filtered });
  return true;
}

// Reset data (only when explicitly requested by user)
export async function resetSystemData(): Promise<boolean> {
  if (isPostgresActive && pgPool) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM publications');
      await client.query('DELETE FROM flagship_programs');
      await client.query('DELETE FROM program_categories');
      await client.query('DELETE FROM instagram_photos');
      await client.query('DELETE FROM system_meta');
      await setupPostgresSchema(client);
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  const resetState: DatabaseState = {
    seeded: true,
    publications: INITIAL_PUBLICATIONS,
    programs: FLAGSHIP_PROGRAMS,
    categories: [
      'Pendidikan & Pelatihan',
      'Bakti Sosial & Lingkungan',
      'Seminar & Riset',
      'Ekspedisi & Lapangan',
      'Organisasi & Tata Kelola'
    ],
    instagramPhotos: INITIAL_INSTAGRAM_PHOTOS,
  };
  fs.writeFileSync(JSON_DB_FILE, JSON.stringify(resetState, null, 2), 'utf-8');
  return true;
}
