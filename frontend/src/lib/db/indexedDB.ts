import Dexie from 'dexie';

export const db = new Dexie('Slate360DB');
db.version(1).stores({
  projects: '++id,name,data'
});

export default db;