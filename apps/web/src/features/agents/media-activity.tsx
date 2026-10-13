import React from 'react';
import Link from 'next/link';
import type { z } from 'zod';
import { mediaInventorySchema } from '@bizoveya/agent-contract';

export function MediaActivity({ inventory, sitePath }: { inventory: z.infer<typeof mediaInventorySchema>; sitePath: string }) {
  return <section className="bz-panel bz-media-activity" aria-labelledby="media-activity-heading">
    <h2 id="media-activity-heading">Voice and artwork activity</h2>
    <p>Optional capabilities are independent. Saved proposals and meetings use their existing review and execution controls.</p>
    <div className="bz-actions"><Link className="bz-button secondary" href={`${sitePath}/media`}>Private image library</Link><Link className="bz-button secondary" href={`${sitePath}/campaigns`}>Content campaigns</Link><Link className="bz-button secondary" href={`${sitePath}/knowledge`}>Approved site knowledge</Link></div>
    {inventory.requests.length ? <ul>{inventory.requests.slice(0, 10).map(request => <li key={request.id}>
      <strong>{request.capability === 'image' ? 'Artwork' : 'Voice'} · {request.status}</strong>
      <p>Accounting: {request.spendingState} · Request <code>{request.id}</code></p>
      {['reserved', 'unknown', 'overrun'].includes(request.spendingState) && <p>{request.providerStarted ? 'An operator must inspect the receipt and reconcile unresolved usage before another attempt. Do not retry the provider.' : 'This request has no recorded provider start. Ask the operator to inspect guarded recovery.'}</p>}
      {request.receipt?.artifactHash && <p>Private artifact saved. Open Image library to review it before composition.</p>}
    </li>)}</ul> : <p>No voice or artwork request is recorded for you at this site.</p>}
  </section>;
}
