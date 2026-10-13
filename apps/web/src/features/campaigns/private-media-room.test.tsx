import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MediaRoom } from './private-media-room';

describe('private image library generation controls', () => {
  it('keeps uploads and the library available when AI artwork is unqualified', () => {
    const html = renderToStaticMarkup(<MediaRoom initial={[]} owner endpoint="/api/media" imageQualification={null} />);
    expect(html).toContain('Upload a private image'); expect(html).toContain('AI artwork is paused or not qualified'); expect(html).toContain('Uploads, templates, text drafts and meetings still work'); expect(html).toContain('Generate one private image'); expect(html).toContain('disabled');
  });
  it('explains one-attempt private generation and separate review when qualified', () => {
    const html = renderToStaticMarkup(<MediaRoom initial={[]} owner endpoint="/api/media" imageQualification={{ version: 2, document: { provider: 'gemini', modelId: 'gemini-3.1-flash-lite-image' } }} />);
    expect(html).toContain('same request is never sent twice'); expect(html).toContain('will not publish anything'); expect(html).toContain('Version preview and review');
  });
});
