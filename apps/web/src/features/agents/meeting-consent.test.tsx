import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { agencyRecordSchema } from './agency-contracts';
import { MeetingSnapshotPanel } from './meeting-snapshot-panel';

it('projects the actual migrated SQL consent history read-only for workspace members', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'bizoveya-member-consent-'));
  try {
    const output = path.join(directory, 'fixture.json');
    execFileSync(process.execPath, ['tools/phase1-verification/run-visual-sql.mjs', '--consent-contract', output], { cwd: path.resolve(process.cwd(), '../..'), timeout: 60000 });
    const record = agencyRecordSchema.parse(JSON.parse(readFileSync(output, 'utf8')).record);
    expect(record.meetingExecutionConsents).toHaveLength(25);
    const html = renderToStaticMarkup(<MeetingSnapshotPanel record={record} owner={false} endpoint="/private" busy={false} lock={{ current: false }} onBusy={() => {}} onSaved={() => {}} />);
    expect(html).toContain('Execution consent and revocation history'); expect(html).toContain('last refresh'); expect(html).not.toContain('Save execution consent'); expect(html).not.toContain('<button');
    const legacy = { ...record, meetingExecutionConsents: undefined }; expect(agencyRecordSchema.parse(legacy).meetingExecutionConsents).toEqual([]);
  } finally { rmSync(directory, { recursive: true, force: true }); }
}, 60000);
