# ADR-0010 — Bounded private site knowledge before agents

Status: implementation decision, adjustable living draft; founder/hosted acceptance pending.

Founder requests continuing while all manual actions remain deferred. Implement P03.1 with deterministic UTF-8 text ingestion, explicit owner review/approval, private site-scoped current retrieval, versions/export/erase. Reuse workspace roles and existing authenticated API patterns; no model spend/key/provider or extra deployment.

Editing resets approval, approved-only retrieval returns cited reviewed facts. Sources are untrusted data, not instructions. Future agent runtime must revalidate exact source revision/approval/membership before an action. Raw history is member-only; deleting source removes revisions and retains a content-free activity event. Provider backups are outside application erase.

PDF/OCR/vector search/model-assisted extraction/public chatbot/job worker/retention for future artifacts remain separately scoped. Capacity20sources/site,40facts/source,16k source chars,100revisions/source is an initial bound. Do not advertise complete RAG or zero-cost future agents. Founder may revise through a recorded decision; all earlier manual tests remain pending in30.
