# Durable assistant execution and recovery

## Implemented slice and remaining scope

Group 2 now gives every generation prepared from a reviewed founder request a durable execution task. Additive migration `052_agency_execution_tasks.sql` preserves migrations 001–051, existing campaigns, successful output `80091597-06eb-4b8e-ae10-6239ae2b2b69`, accepted reviews and all media/template history. The task follows the existing qualified generation runtime; this slice does not replace its provider, spending, authorization or human-review boundaries.

The task begins at `awaiting_authorization`, records an immutable versioned event for authorization and completion, and projects its current state to the admin queue and site Agency room. A completed output becomes `awaiting_human_review`; recorded failure or cancellation remains terminal. An incomplete or uncertain finish becomes `recovery_required`. Members can see status and recovery reasons, while only the owner with platform-admin access and MFA can authorize or reconcile.

This is real execution tracking and recovery, not autonomous background scheduling and not completion of all first four evolution groups. Actual agent meetings, announcement distribution and live voice remain later Group 3 and Group 4 work. Optional AI visual generation is still unqualified. Office visualization remains ON HOLD for founder design input, and custom agents remain out of scope.

## Recovery and retry safety

The admin queue now shows the task state, version, last reason and whether an unfinished dispatch lease has expired. A running task cannot be authorized again through either the interface or direct RPC. An active lease returns busy. An expired lease must first pass the explicit recovery action with the displayed task version, a 10–300 character reason and reviewed confirmation.

Recovery never calls a provider. It classifies stored evidence under the same admission lock:

- no unsettled stage request permits `safe_resume` and returns the task to `awaiting_authorization`;
- a reserved stage without `provider_started_at` is cancelled through the existing guarded cancellation function and settled at zero;
- a provider-start marker, unknown spending or overrun spending remains `recovery_required` and cannot be retried;
- a genuinely succeeded, failed or cancelled run is synchronized to that terminal task state.

An expired unfinished dispatch is closed as blocked after classification. Exact task-version checks prevent stale tabs from reconciling newer evidence. Task/event versions are bounded, events are immutable, direct private-table access is denied and site deletion cascades the task history. Existing generation runs that were not created through the reviewed-request handoff remain visible with a null task and retain their original runtime behavior.

No API key or environment field is added. The only new form field is **Recovery review reason**. Its safe copy/paste sample is:

`Inspect this interrupted private draft task without retrying a provider request.`

The required checkbox reads: `I reviewed the stage markers and spending state. Reconcile only; never repeat an uncertain provider request.`

## Four deferred founder checks — MT192–195

1. **Install and preserve.** Later apply only missing migrations in order through `052_agency_execution_tasks.sql`, then reload the existing accepted campaign and Agency planning. Expected: all existing drafts, reviews, templates and images remain intact; reviewed-request prepared runs show an execution task. No new key or setting is required.
2. **Visibility and authorization guard.** With a disposable reviewed request prepared under MT188–191, compare the owner Agency room and admin generation queue. Expected: both show the same task version/state; a viewer can read the site status but cannot authorize or recover it. Do not authorize the accepted production pilot or regenerate it.
3. **Expired safe recovery, when evidence exists.** Only after a separately authorized disposable task has genuinely expired, enter `Inspect this interrupted private draft task without retrying a provider request.`, check the recovery confirmation and click **Reconcile interrupted task** once. Expected: no provider call; no unsettled request returns `safe_resume`, while an unstarted reservation is settled at zero.
4. **Uncertain and stale guards.** If a disposable task contains a genuine provider-start/unknown-spending marker, reconcile once and then attempt authorization. Expected: it stays `recovery_required` and retry is blocked. A second browser tab using the old displayed task version must report a conflict. Do not fabricate or edit production accounting evidence just to perform this check.

## Automated verification and continuation

Ephemeral PGlite applies all 52 migrations and 16 SQL assertion scripts. The new assertions cover task creation, authorization, active and expired retry guards, safe resume, zero-cost unstarted cancellation, provider-start preservation, immutable history, role isolation and cascade. App tests cover strict recovery input/output, MFA/admin RPC admission, actionable errors and the member/admin projections. No hosted SQL, browser, real concurrency, provider request, paid operation, deployment-setting change or publication was performed.

Next documented implementation is Group 3: durable meeting sessions, reviewed announcements, participant acknowledgement and bounded task distribution using the existing request/task lineage. It must not infer meeting participation, send external messages or begin office visualization.
