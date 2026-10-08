import {PGlite} from '@electric-sql/pglite';
import {pgcrypto} from '@electric-sql/pglite/contrib/pgcrypto';
import {readFile,readdir} from 'node:fs/promises';
const root=new URL('../../',import.meta.url),read=path=>readFile(new URL(path,root),'utf8');
const db=await PGlite.create({extensions:{pgcrypto}});let step='bootstrap';
try {
 await db.exec(await read('tools/phase1-verification/bootstrap.sql'));
 const migrations=(await readdir(new URL('supabase/migrations/',root))).filter(name=>name.endsWith('.sql')).sort();
 for(const name of migrations){if(name.startsWith('040_')){step='039_visual_composition_assertions.sql before040';await db.exec(await read('supabase/tests/039_visual_composition_assertions.sql'));}step=name;await db.exec(await read(`supabase/migrations/${name}`));}
 for(const name of ['037_generation_dispatch_assertions.sql','039_visual_composition_assertions.sql','040_visual_template_assertions.sql']){step=name;await db.exec(await read(`supabase/tests/${name}`));}
 console.log(JSON.stringify({status:'passed',migrations:migrations.length,assertionScripts:4,scope:'Ephemeral PGlite with simulated Supabase auth. No hosted SQL, provider call, true concurrency or browser acceptance.'}));
}catch(error){console.error(JSON.stringify({status:'failed',step,message:error.message,detail:error.detail,where:error.where}));process.exitCode=1;}finally{await db.close();}
