import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { meetingSnapshotReviewSchema } from '@/features/agents/meeting-snapshot-contracts';
import { reviewMeetingSnapshot } from '@/features/agents/meeting-snapshot-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params, input = await readInput(request, meetingSnapshotReviewSchema, 2000);
  return workspaceJson(await reviewMeetingSnapshot(db, userId, p.workspaceId, p.siteId, input));
});
