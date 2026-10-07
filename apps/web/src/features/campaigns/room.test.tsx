import React from 'react';
import {beforeAll,describe,it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.mock('next/navigation',()=>({useRouter:()=>({replace:vi.fn(),refresh:vi.fn()})}));
import {CampaignRoom} from './room';
beforeAll(()=>{(globalThis as {React?:typeof React}).React=React;});
describe('private working-copy download controls',()=>{
 it('offers a local download without an editable saved campaign or completed model output',()=>{
  const html=renderToStaticMarkup(<CampaignRoom records={[]} history={[]} generations={[]} endpoint="/private/campaigns" base="/private/campaigns" canWrite/>);
  expect(html).toContain('Download working copy (JSON)');expect(html).toContain('file labels unsaved edits');expect(html).toContain('No completed generated drafts yet');
 });
 it('keeps authorized read-only visible drafts downloadable while edits remain disabled',()=>{
  const html=renderToStaticMarkup(<CampaignRoom records={[]} history={[]} generations={[]} endpoint="/private/campaigns" base="/private/campaigns" canWrite={false}/>);
  expect(html).toContain('<fieldset disabled=""');expect(html).toMatch(/<button type="button" class="bz-button">Download working copy/);expect(html).toContain('Your role is read-only');
 });
});
