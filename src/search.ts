import Fuse from 'fuse.js';

export interface SearchDocument {
  /** Path matched by the client router, e.g. `/zh/guide/start/`. */
  pathname: string;
  locale: string;
  title: string;
  content: string;
}

const cjkPattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

export function createPageSearch(documents: SearchDocument[]): (query: string) => SearchDocument[] {
  const indexedDocuments = documents.map((document) => ({
    document,
    cjkContent: `${document.title}${document.content}`.replaceAll(
      /[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu,
      '',
    ),
  }));
  const fuseOptions = {
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  } as const;
  const fuse = new Fuse(indexedDocuments, {
    ...fuseOptions,
    keys: [
      { name: 'document.title', weight: 2 },
      { name: 'document.content', weight: 1 },
      { name: 'cjkContent', weight: 1 },
    ],
  });
  // CJK queries match better against text stripped of separators and Latin words.
  const cjkFuse = new Fuse(indexedDocuments, {
    ...fuseOptions,
    keys: ['cjkContent'],
  });

  return (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return documents;

    const index = cjkPattern.test(trimmedQuery) ? cjkFuse : fuse;
    return index.search(trimmedQuery).map(({ item }) => item.document);
  };
}
