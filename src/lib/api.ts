import { Publication } from '../types/publication';
import { FlagshipProgram } from '../types/program';
import { InstagramPhotoItem } from '../data/initialInstagramPhotos';

// API client with graceful fallback

export async function fetchPublicationsApi(): Promise<Publication[] | null> {
  try {
    const res = await fetch('/api/publications');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('API fetchPublications unavailable, using local cache:', e);
  }
  return null;
}

export async function savePublicationApi(pub: Publication): Promise<boolean> {
  try {
    const res = await fetch('/api/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pub),
    });
    return res.ok;
  } catch (e) {
    console.warn('API savePublication failed:', e);
    return false;
  }
}

export async function deletePublicationApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/publications/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    console.warn('API deletePublication failed:', e);
    return false;
  }
}

export async function fetchProgramsApi(): Promise<FlagshipProgram[] | null> {
  try {
    const res = await fetch('/api/programs');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('API fetchPrograms unavailable, using local cache:', e);
  }
  return null;
}

export async function saveProgramApi(prog: FlagshipProgram): Promise<boolean> {
  try {
    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prog),
    });
    return res.ok;
  } catch (e) {
    console.warn('API saveProgram failed:', e);
    return false;
  }
}

export async function deleteProgramApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/programs/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    console.warn('API deleteProgram failed:', e);
    return false;
  }
}

export async function fetchCategoriesApi(): Promise<string[] | null> {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('API fetchCategories unavailable, using local cache:', e);
  }
  return null;
}

export async function saveCategoriesApi(categories: string[]): Promise<boolean> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories }),
    });
    return res.ok;
  } catch (e) {
    console.warn('API saveCategories failed:', e);
    return false;
  }
}

export async function fetchInstagramPhotosApi(): Promise<InstagramPhotoItem[] | null> {
  try {
    const res = await fetch('/api/instagram-photos');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('API fetchInstagramPhotos unavailable, using local cache:', e);
  }
  return null;
}

export async function saveInstagramPhotoApi(photo: InstagramPhotoItem): Promise<boolean> {
  try {
    const res = await fetch('/api/instagram-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo),
    });
    return res.ok;
  } catch (e) {
    console.warn('API saveInstagramPhoto failed:', e);
    return false;
  }
}

export async function deleteInstagramPhotoApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/instagram-photos/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    console.warn('API deleteInstagramPhoto failed:', e);
    return false;
  }
}

export async function resetSystemDataApi(): Promise<boolean> {
  try {
    const res = await fetch('/api/reset-data', {
      method: 'POST',
    });
    return res.ok;
  } catch (e) {
    console.warn('API resetSystemData failed:', e);
    return false;
  }
}
