import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect} from 'vitest';
import {MeetingDeliveryRoom} from './room';
import {deliveryQueueSchema} from './contracts';
const id='11111111-1111-4111-8111-111111111111';
const meeting={meetingId:id,siteId:id,meetingVersion:4,sourceVersion:3,rosterVersion:1,agenda:'Compare private launch options.',createdAt:'now',blocked:false,participants:[{role:'content',agentId:id,agentVersion:5,state:'invited',claimId:null,leaseActive:false,note:null}]};
describe('operator packet receipt interface',()=>{
 const render=(record:unknown=meeting,configured=true)=>renderToStaticMarkup(<MeetingDeliveryRoom initial={{meetings:deliveryQueueSchema.parse([record]),setup:{recorderConfigured:configured}}}/>);
 it('shows exact versions and receipt-only review without model or key inputs',()=>{const html=render();expect(html).toContain('pinned team v1');expect(html).toContain('pinned role and versions');expect(html).toContain('Deliver selected packet');expect(html).toContain('Acknowledgement records receipt only');expect(html).not.toContain('apiKey');});
 it('disables missing recorder, blocked meeting, active claim and terminal receipt controls',()=>{
  expect(render(meeting,false)).toContain('<fieldset disabled=""');
  for(const record of [{...meeting,blocked:true},{...meeting,participants:[{...meeting.participants[0],state:'claimed',leaseActive:true}]},{...meeting,participants:[{...meeting.participants[0],state:'acknowledged',note:'Recorded receipt only.'}]}])expect(render(record)).toContain('<fieldset disabled=""');
 });
});
