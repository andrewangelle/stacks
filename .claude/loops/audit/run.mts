import {
  type EffortLevel,
  type Options,
  type PermissionMode,
  query,
} from '@anthropic-ai/claude-agent-sdk';
import { LOAD_PROJECT_CONTEXT, REPO_ROOT, TURN_CAP } from './constants.mts';
import { colors } from './utils.mts';

type RunResult = {
  text: string;
  subtype: string;
  cost: number;
};

type RunArgs = {
  prompt: string;
  model: string;
  effort: EffortLevel;
  allowedTools: string[];
  permissionMode: PermissionMode;
  disallowedTools?: string[];
};

/** One headless call. */
export async function run({
  prompt,
  model,
  effort,
  allowedTools,
  permissionMode,
  disallowedTools = [],
}: RunArgs): Promise<RunResult> {
  let text = '';
  let subtype = 'unknown';
  let cost = 0;

  const options: Options = {
    cwd: REPO_ROOT,
    model,
    effort,
    allowedTools,
    disallowedTools,
    permissionMode,
    maxTurns: TURN_CAP,
    settingSources: LOAD_PROJECT_CONTEXT ? ['project'] : [],
    ...(permissionMode === 'bypassPermissions'
      ? { allowDangerouslySkipPermissions: true }
      : {}),
  };

  let turn = 0;

  for await (const msg of query({ prompt, options })) {
    if (msg.type === 'assistant') {
      for (const block of msg.message.content) {
        if (block.type === 'tool_use') {
          turn++;
          const inp = (block.input ?? {}) as Record<string, unknown>;
          const detail = inp.file_path ?? inp.pattern ?? inp.command ?? '';
          console.log(
            `  ${colors.dim(`[${turn}/${TURN_CAP}]`)} ${colors.tool(block.name)} ${colors.dim(String(detail))}`,
          );
        }
      }
    } else if (msg.type === 'result') {
      subtype = msg.subtype;
      if (typeof msg.total_cost_usd === 'number') cost = msg.total_cost_usd;
      if (msg.subtype === 'success' && msg.result) text = msg.result;
    }
  }
  return { text, subtype, cost };
}
