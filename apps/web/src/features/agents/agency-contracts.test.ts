import { describe, expect, it } from 'vitest';
import { agencyCommandSchema, agencyHandoffSchema, meetingDeliberationSchema, meetingScheduleSchema, meetingDistributionSchema, meetingInvitationSchema, delegationProposal, voiceEntryState } from './agency-contracts';
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

it('requires an exact reviewed meeting invitation version without execution fields', () => {
 const input={id:request.id,expectedVersion:3,reviewed:true};
 expect(meetingInvitationSchema.safeParse(input).success).toBe(true);
 for(const invalid of [{...input,reviewed:false},{...input,expectedVersion:100},{...input,execute:true}]) expect(meetingInvitationSchema.safeParse(invalid).success).toBe(false);
});

it('admits only reviewed bounded deliberation limits with an independent retry identity', () => {
 const input={id:request.id,planId:'00000000-0000-4000-8000-000000000002',expectedVersion:4,rounds:1,maxInputTokensPerTurn:1200,maxOutputTokensPerTurn:600,maxTotalCostCents:5,reviewed:true};
 expect(meetingDeliberationSchema.safeParse(input).success).toBe(true);
 for(const invalid of [{...input,planId:input.id},{...input,reviewed:false},{...input,rounds:3},{...input,maxInputTokensPerTurn:2001},{...input,maxOutputTokensPerTurn:127},{...input,maxTotalCostCents:26},{...input,execute:true}]) expect(meetingDeliberationSchema.safeParse(invalid).success).toBe(false);
});

it('rejects unreviewed, injected or oversized campaign handoffs', () => {
 const input={id:request.id,campaignId:request.id,expectedVersion:1,title:'Private request handoff',reviewed:true};
 expect(agencyHandoffSchema.safeParse(input).success).toBe(true);
 for(const invalid of [{...input,reviewed:false},{...input,execute:true},{...input,title:'x'.repeat(121)},{...input,title:'bad\nline'},{...input,expectedVersion:0}]) expect(agencyHandoffSchema.safeParse(invalid).success).toBe(false);
});

it('requires intent-only review and strict scheduling identities, bounds and reasons',()=>{
 const input={id:request.id,planId:'00000000-0000-4000-8000-000000000002',operationId:'00000000-0000-4000-8000-000000000003',expectedMeetingVersion:5,expectedVersion:0,action:'queue',reason:'Queue bounded private scheduling intent.',reviewed:true,intentOnly:true};
 expect(meetingScheduleSchema.safeParse(input).success).toBe(true);
 for(const invalid of [{...input,id:null},{...input,planId:input.id},{...input,operationId:null},{...input,expectedVersion:100},{...input,expectedMeetingVersion:0},{...input,reviewed:false},{...input,intentOnly:false},{...input,action:'execute'},{...input,reason:'short'},{...input,reason:'x'.repeat(301)},{...input,reason:'Reviewed\nprivate intent.'},{...input,execute:true}]) expect(meetingScheduleSchema.safeParse(invalid).success).toBe(false);
});
