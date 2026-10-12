import {PGlite} from '@electric-sql/pglite';
import {pgcrypto} from '@electric-sql/pglite/contrib/pgcrypto';
import {readFile,readdir,writeFile} from 'node:fs/promises';
const root=new URL('../../',import.meta.url),read=path=>readFile(new URL(path,root),'utf8');
const db=await PGlite.create({extensions:{pgcrypto}});let step='bootstrap';
try {
 await db.exec(await read('tools/phase1-verification/bootstrap.sql'));
 const migrations=(await readdir(new URL('supabase/migrations/',root))).filter(name=>name.endsWith('.sql')).sort();
 for(const name of migrations){if(name.startsWith('040_')){step='039_visual_composition_assertions.sql before040';await db.exec(await read('supabase/tests/039_visual_composition_assertions.sql'));}step=name;await db.exec(await read(`supabase/migrations/${name}`));}
 let contracts=[],meetingContract,snapshotContract,consentContract;
const scripts=['037_generation_dispatch_assertions.sql','039_visual_composition_assertions.sql','040_visual_template_assertions.sql','041_private_template_assertions.sql','042_private_template_visual_provenance_assertions.sql','043_private_campaign_media_assertions.sql','044_private_media_hardening_assertions.sql','045_agency_planning_assertions.sql','046_private_media_lifecycle_assertions.sql','047_campaign_image_draft_assertions.sql','048_agency_campaign_handoff_assertions.sql','049_agency_onboarding_assertions.sql','050_site_agent_roster_assertions.sql','051_agency_generation_handoff_assertions.sql','052_agency_execution_task_assertions.sql','053_meeting_request_distribution_assertions.sql','054_meeting_participant_invitation_assertions.sql','055_meeting_receipt_admission_assertions.sql','056_bounded_deliberation_plan_assertions.sql','057_deliberation_identity_assertions.sql','058_deliberation_schedule_assertions.sql'];
 scripts.push('059_operator_meeting_delivery_assertions.sql');
 scripts.push('060_qualified_deliberation_snapshot_assertions.sql');
 scripts.push('061_meeting_execution_consent_assertions.sql');
 scripts.push('062_meeting_turn_accounting_assertions.sql');
 scripts.push('063_meeting_turn_execution_receipt_assertions.sql');
 scripts.push('064_reviewed_meeting_deliberation_outcome_assertions.sql');
 scripts.push('065_reviewed_meeting_outcome_request_handoff_assertions.sql');
 scripts.push('066_meeting_terminal_recovery_assertions.sql');
 scripts.push('067_reviewed_announcement_knowledge_handoff_assertions.sql');
 scripts.push('068_private_channel_specialist_delegation_assertions.sql');
 for(const name of scripts){step=name;const results=await db.exec(await read(`supabase/tests/${name}`));if(name.startsWith('041_'))contracts=results.flatMap(r=>r.rows).flatMap(row=>Object.values(row)).filter(value=>value&&typeof value==='object'&&Array.isArray(value.versions));if(name.startsWith('059_'))meetingContract=results.flatMap(r=>r.rows).find(row=>row.contract059)?.contract059;if(name.startsWith('060_'))snapshotContract=results.flatMap(r=>r.rows).find(row=>row.contract060)?.contract060;if(name.startsWith('061_'))consentContract=results.flatMap(r=>r.rows).find(row=>row.contract061)?.contract061;}
 if(process.argv[2]==='--contracts'){if(!process.argv[3]||!contracts.length)throw new Error('Contract output path or snapshots missing');await writeFile(process.argv[3],JSON.stringify(contracts));}
 if(process.argv[2]==='--meeting-contract'){if(!process.argv[3]||!meetingContract)throw new Error('Meeting contract output path or fixture missing');await writeFile(process.argv[3],JSON.stringify(meetingContract));}
 if(process.argv[2]==='--snapshot-contract'){if(!process.argv[3]||!snapshotContract)throw new Error('Snapshot contract output path or fixture missing');await writeFile(process.argv[3],JSON.stringify(snapshotContract));}
 if(process.argv[2]==='--consent-contract'){if(!process.argv[3]||!consentContract)throw new Error('Consent contract output path or fixture missing');await writeFile(process.argv[3],JSON.stringify(consentContract));}
 console.log(JSON.stringify({status:'passed',migrations:migrations.length,assertionScripts:scripts.length+1,scope:'Ephemeral PGlite with simulated Supabase auth. No hosted SQL, Storage service, byte sanitizer, provider call, true concurrency or browser acceptance.'}));
}catch(error){console.error(JSON.stringify({status:'failed',step,message:error.message,detail:error.detail,where:error.where}));process.exitCode=1;}finally{await db.close();}
