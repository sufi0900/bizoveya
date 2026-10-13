import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MediaActivity } from './media-activity';
describe('integrated media activity', () => {
  it('keeps core workflow links available without media qualification', () => {
    const html = renderToStaticMarkup(createElement(MediaActivity, { inventory: { capabilities: [], requests: [] }, sitePath: '/workspaces/w/sites/s' }));
    expect(html).toContain('/workspaces/w/sites/s/campaigns');
    expect(html).toContain('/workspaces/w/sites/s/knowledge');
    expect(html).toContain('No voice or artwork request');
  });
});
