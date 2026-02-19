import Fuse from 'fuse.js';

export interface SearchItem {
  id: string;
  type: 'topic' | 'question';
  title: string;
  description: string;
  slug?: string;
  topicId?: string;
  topicTitle?: string;
  difficulty: string;
  tags: string[];
  content: string;
}

let fuseInstance: Fuse<SearchItem> | null = null;
let indexedItems: SearchItem[] = [];

const FUSE_OPTIONS: Fuse.IFuseOptions<SearchItem> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.2 },
    { name: 'tags', weight: 0.2 },
    { name: 'content', weight: 0.1 },
    { name: 'topicTitle', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

export function buildIndex(items: SearchItem[]) {
  indexedItems = items;
  fuseInstance = new Fuse(items, FUSE_OPTIONS);
}

export function search(query: string, filters?: { type?: 'topic' | 'question'; difficulty?: string }) {
  if (!fuseInstance || !query.trim()) return [];

  let results = fuseInstance.search(query).map((r) => r.item);

  if (filters?.type) results = results.filter((r) => r.type === filters.type);
  if (filters?.difficulty) results = results.filter((r) => r.difficulty === filters.difficulty);

  return results.slice(0, 20);
}

export function getIndexedItems() {
  return indexedItems;
}
