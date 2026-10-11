import { describe, expect, it } from 'vitest';
import { agencyCommandSchema, agencyHandoffSchema, meetingDistributionSchema, delegationProposal, voiceEntryState } from './agency-contracts';
const request = { action: 'request' as const, id: '00000000-0000-4000-8000-000000000001', instruction: 'Prepare private drafts from approved facts.', channels: ['pinterest'] as const, reviewed: true as const, inputMode: 'text' as const };
describe('agency planning admission', () => {
  it('requires explicit confirmation and rejects duplicate channels, controls and injected execution flags', () => {
    expect(agencyCommandSchema.safeParse(request).success).toBe(true);
    for (const command of [{ ...request, reviewed: false }, { ...request, channels: ['pinterest', 'pinterest'] }, { ...request, instruction: '\u0001' }, { ...request, execute: true }]) expect(agencyCommandSchema.safeParse(command).success).toBe(false);
  });
  it('keeps channel delegation proposed and business voice disabled', () => {
    const parsed = agencyCommandSchema.parse(request);
    if (parsed.action !== 'request') throw new Error('Fixture mismatch');
    expect(delegationProposal(parsed)[0]).toMatchObject({ channel: 'pinterest', role: 'content', state: 'proposed' });
    expect(voiceEntryState.enabled).toBe(false);
  });
  it('requires optimistic version and a reviewed reason for decisions', () => {
    expect(agencyCommandSchema.safeParse({ action: 'cancel', id: request.id, expectedVersion: 0, reviewed: true, reason: 'Cancel' }).success).toBe(false);
  });
});

it('admits only bounded reviewed meeting distributions with independent request identity', () => {
 const input={id:request.id,requestId:'00000000-0000-4000-8000-000000000002',expectedVersion:2,instruction:'Prepare private drafts.',channels:['pinterest'],reviewed:true};
 expect(meetingDistributionSchema.safeParse(input).success).toBe(true);
 for(const invalid of [{...input,requestId:input.id},{...input,reviewed:false},{...input,expectedVersion:100},{...input,channels:['blog','blog']},{...input,execute:true},{...input,instruction:'x'.repeat(1401)},{...input,instruction:'\u0001'}]) expect(meetingDistributionSchema.safeParse(invalid).success).toBe(false);
});

it('rejects unreviewed, injected or oversized campaign handoffs', () => {
 const input={id:request.id,campaignId:request.id,expectedVersion:1,title:'Private request handoff',reviewed:true};
 expect(agencyHandoffSchema.safeParse(input).success).toBe(true);
 for(const invalid of [{...input,reviewed:false},{...input,execute:true},{...input,title:'x'.repeat(121)},{...input,title:'bad\nline'},{...input,expectedVersion:0}]) expect(agencyHandoffSchema.safeParse(invalid).success).toBe(false);
});
