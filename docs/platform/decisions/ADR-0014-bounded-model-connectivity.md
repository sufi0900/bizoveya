# ADR-0014 — Bounded model connectivity before customer runtime

Status: accepted implementation scope1.17; live qualification/founder acceptance pending.

The founder authorized the next implementation while testing1.16. Follow the documented P04.0 prerequisite: prove exact provider/model connectivity before binding models to customer agents. Use current saved profiles and fixed SDK adapters, a synthetic fixed prompt, explicit charged-request acknowledgement, disabled-by-default execution, five attempts per UTC day and one active reservation. Persist versioned redacted results; no raw model output or customer knowledge. Only a server service-role RPC may finish a result. This adds a private admin-server setup requirement documented in36.

A passing match proves neither output quality nor monetary budget enforcement. Keep runtime/visual generation/publishing gates separate; no model choice or pricing assumption is hardcoded. Old migrations and founder acceptance records remain preserved.
