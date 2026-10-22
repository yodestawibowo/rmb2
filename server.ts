import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  initPostgres, 
  getDbStatus,
  getAllPublications, 
  upsertPublication, 
  deletePublicationById,
  getAllPrograms, 
  upsertProgram, 
  deleteProgramById,
  getAllCategories, 
  saveCategoriesList,
  getAllInstagramPhotos, 
  upsertInstagramPhoto, 
  deleteInstagramPhotoById,
  resetSystemData
} from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Dev server must run on port 3000 per environment constraints
  const PORT = 3000;

  // Large payload allowance for base64 / documentation images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Initialize PostgreSQL Connection
  await initPostgres();

  // ---------------------------------------------------------------------------
  // API Routes
  // ---------------------------------------------------------------------------

  // Health and Database Engine Status
  app.get('/api/status', async (_req: Request, res: Response) => {
    try {
      const status = await getDbStatus();
      res.json({ ok: true, status });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Publications API
  app.get('/api/publications', async (_req: Request, res: Response) => {
    try {
      const publications = await getAllPublications();
      res.json(publications);
    } catch (e: any) {
      console.error('API Error /api/publications:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/publications', async (req: Request, res: Response) => {
    try {
      const pub = req.body;
      if (!pub || !pub.id || !pub.title) {
        return res.status(400).json({ error: 'Valid publication payload is required' });
      }
      const saved = await upsertPublication(pub);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/publications:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/publications/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await deletePublicationById(id);
      res.json({ success, deletedId: id });
    } catch (e: any) {
      console.error('API Error DELETE /api/publications/:id:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Programs API
  app.get('/api/programs', async (_req: Request, res: Response) => {
    try {
      const programs = await getAllPrograms();
      res.json(programs);
    } catch (e: any) {
      console.error('API Error /api/programs:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/programs', async (req: Request, res: Response) => {
    try {
      const program = req.body;
      if (!program || !program.id || !program.title) {
        return res.status(400).json({ error: 'Valid program payload is required' });
      }
      const saved = await upsertProgram(program);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/programs:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/programs/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await deleteProgramById(id);
      res.json({ success, deletedId: id });
    } catch (e: any) {
      console.error('API Error DELETE /api/programs/:id:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Categories API
  app.get('/api/categories', async (_req: Request, res: Response) => {
    try {
      const categories = await getAllCategories();
      res.json(categories);
    } catch (e: any) {
      console.error('API Error /api/categories:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/categories', async (req: Request, res: Response) => {
    try {
      const { categories } = req.body;
      if (!Array.isArray(categories)) {
        return res.status(400).json({ error: 'categories must be an array' });
      }
      const saved = await saveCategoriesList(categories);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/categories:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Instagram Photo Feed API
  app.get('/api/instagram-photos', async (_req: Request, res: Response) => {
    try {
      const photos = await getAllInstagramPhotos();
      res.json(photos);
    } catch (e: any) {
      console.error('API Error /api/instagram-photos:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/instagram-photos', async (req: Request, res: Response) => {
    try {
      const photo = req.body;
      if (!photo || !photo.id || !photo.title) {
        return res.status(400).json({ error: 'Valid photo payload is required' });
      }
      const saved = await upsertInstagramPhoto(photo);
      res.json(saved);
    } catch (e: any) {
      console.error('API Error POST /api/instagram-photos:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/instagram-photos/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await deleteInstagramPhotoById(id);
      res.json({ success, deletedId: id });
    } catch (e: any) {
      console.error('API Error DELETE /api/instagram-photos/:id:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Explicit Reset Endpoint
  app.post('/api/reset-data', async (_req: Request, res: Response) => {
    try {
      await resetSystemData();
      res.json({ success: true, message: 'System data reset to initial seed' });
    } catch (e: any) {
      console.error('API Error /api/reset-data:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // ---------------------------------------------------------------------------
  // Vite Middleware / Static Serving
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mount Vite middlewares in development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 WartaKarsa server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
