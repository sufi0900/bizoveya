import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const db = await PGlite.create({ extensions: { pgcrypto } });
const report = { startedAt: new Date().toISOString(), engine: 'PGlite 0.5.8 (PostgreSQL WASM)', scope: 'Ephemeral local SQL with simulated Supabase Auth/Storage schema and JWT settings; no real Auth, PostgREST, Storage, concurrency or remote migration proof.', steps: [] };
let current = 'bootstrap';
try {
  await db.exec(await read('tools/phase1-verification/bootstrap.sql'));
  report.postgres = (await db.query('select version()')).rows[0].version;
  for (const name of (await readdir(new URL('supabase/migrations/',root))).filter(x => x.endsWith('.sql') && !/^03[2-4]_/.test(x)).sort()) {
    current = `migration:${name}`; const sql = await read(`supabase/migrations/${name}`);
    await db.exec(sql); report.steps.push({ name: current, status: 'passed', sha256: createHash('sha256').update(sql).digest('hex') });
  }
  for (const name of (await readdir(new URL('supabase/tests/',root))).filter(x => x.endsWith('.sql') && !/^03[2-4]_/.test(x)).sort()) {
    current = `assertions:${name}`; const sql = await read(`supabase/tests/${name}`);
    await db.exec(sql); report.steps.push({ name: current, status: 'passed', sha256: createHash('sha256').update(sql).digest('hex') });
    const counts = await db.query('select (select count(*) from auth.users)::int as users,(select count(*) from public.bizoveya_workspaces)::int as workspaces,(select count(*) from bizoveya_private.admin_audit)::int as audit');
    if (Object.values(counts.rows[0]).some(v => v !== 0)) throw new Error('Assertion fixtures did not roll back');
  }
  for(const name of ['032_spending_controls.sql','033_campaign_draft_foundation.sql','034_generation_run_snapshots.sql']){current=`migration:${name}`;await db.exec(await read(`supabase/migrations/${name}`));report.steps.push({name:current,status:'passed'});}
  for(const name of ['032_spending_assertions.sql','033_campaign_assertions.sql','034_generation_snapshot_assertions.sql']){current=`assertions:${name}`;await db.exec(await read(`supabase/tests/${name}`));report.steps.push({name:current,status:'passed'});}
  // Independent upgrade path with real SQL data written between release boundaries.
  current = 'upgrade scenario';
  const upgrade = await PGlite.create({ extensions: { pgcrypto } });
  try {
    await upgrade.exec(await read('tools/phase1-verification/bootstrap.sql'));
    let beforeRepair; let legacyDraft;
    const snapshot = async () => (await upgrade.query(`select jsonb_build_object(
      'projects',(select jsonb_agg(to_jsonb(p) order by id) from public.projects p),
      'workspaces',(select jsonb_agg(to_jsonb(w) order by id) from public.bizoveya_workspaces w),
      'memberships',(select jsonb_agg(to_jsonb(m) order by user_id) from public.bizoveya_memberships m),
      'sites',(select jsonb_agg(to_jsonb(s) order by id) from public.bizoveya_sites s where mode <> 'native_business'),
      'admins',(select jsonb_agg(to_jsonb(a) order by user_id) from bizoveya_private.platform_admins a),
      'audit',(select jsonb_agg(to_jsonb(e) order by id) from bizoveya_private.admin_audit e)
    ) as state`)).rows[0].state;
    for (const name of (await readdir(new URL('supabase/migrations/',root))).filter(x => x.endsWith('.sql')).sort()) {
      current = `upgrade:${name}`;
      await upgrade.exec(await read(`supabase/migrations/${name}`));
      if (name.startsWith('017_')) await upgrade.exec(await read('tools/phase1-verification/upgrade-fixture.sql'));
      if (name.startsWith('018_')) await upgrade.exec(await read('tools/phase1-verification/upgrade-workspace.sql'));
      if (name.startsWith('021_')) {
        const fixture = JSON.stringify({schemaVersion:1,templateId:'service-studio-v1',accent:'mint',name:'Preserved business',headline:'Original content',description:'Original introduction',about:'Original story',location:'Original area',email:'',phone:'',services:[{title:'Original service',description:'Original detail'}]});
        await upgrade.exec(`set role authenticated; select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);`);
        const workspace = (await upgrade.query("select id from public.bizoveya_workspaces where name='Preserved workspace'")).rows[0].id;
        const site = (await upgrade.query("select id from public.bz_register_site($1,'Preserved business','native_business','business',null,null,'active',true)",[workspace])).rows[0].id;
        await upgrade.query('select public.bz_save_business_draft($1,$2,$3::jsonb,0)',[workspace,site,fixture]);
        await upgrade.exec('reset role');
        legacyDraft = (await upgrade.query('select to_jsonb(d) as row from public.bizoveya_business_drafts d')).rows[0].row;
      }
      if (name.startsWith('022_')) {
        const after = (await upgrade.query('select to_jsonb(d) as row from public.bizoveya_business_drafts d')).rows[0].row;
        if (JSON.stringify(legacyDraft) !== JSON.stringify(after)) throw new Error('022 rewrote existing business draft or metadata');
        report.steps.push({name:'upgrade:021 -> 022 preserves schema-v1 draft byte-equivalent JSON, version and metadata',status:'passed'});
      }
      if (name.startsWith('019_')) {
        await upgrade.query("select bizoveya_private.set_platform_admin($1,true,$2,$3)",['11111111-1111-4111-8111-111111111111','upgrade-test-operator','Preserved operator grant before repair']);
        beforeRepair = await snapshot();
      }
    }
    const afterRepair = await snapshot();
    if (!beforeRepair || JSON.stringify(beforeRepair) !== JSON.stringify(afterRepair)) throw new Error('Repair changed pre-existing project/workspace/grant/audit data');
    if (afterRepair.projects?.[0]?.document?.fixture !== 'legacy document unchanged' || afterRepair.sites?.[0]?.project_id !== '22222222-2222-4222-8222-222222222222') throw new Error('Legacy upgrade fixture was not preserved');
    report.steps.push({ name:'upgrade:017 legacy -> 018 workspace -> 019 admin -> 020 recovery -> 021 private drafts -> 022 modular validation',status:'passed', preserved:['project document','workspace','membership','native project mapping','admin grant','audit events'] });
  } finally { await upgrade.close(); }
  report.status = 'passed';
} catch (error) {
  report.status = 'failed'; report.failure = { step: current, code: error.code, message: error.message, detail: error.detail, where: error.where };
  process.exitCode = 1;
} finally {
  await db.close(); report.finishedAt = new Date().toISOString();
  const outputIndex = process.argv.indexOf('--report');
  if (outputIndex >= 0 && process.argv[outputIndex + 1]) await writeFile(process.argv[outputIndex + 1],JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}
