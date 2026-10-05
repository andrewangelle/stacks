import {
  type EffortLevel,
  type Options,
  type PermissionMode,
  query,
} from '@anthropic-ai/claude-agent-sdk';
import {
  AUDIT_EFFORT,
  AUDIT_MODEL,
  FIX_EFFORT,
  FIX_MODEL,
  LOAD_PROJECT_CONTEXT,
  REPO_ROOT,
  REQUIRED_CLEAN,
  TURN_CAP,
} from './constants.mts';
import { AUDIT_PROMPT, FIX_PROMPT } from './prompt.mts';
import {
  colors,
  colorVerdicts,
  errorColors,
  sha,
  verdictIsPass,
} from './utils.mts';

export type MainArgs = {
  plan: string;
  scopePaths: string[];
  testCmd: string;
  maxIters: number;
};

export async function main({
  plan,
  scopePaths,
  testCmd,
  maxIters,
}: MainArgs): Promise<number> {
  const scope =
    scopePaths.map((p) => `  - ${p}`).join('\n') || '  - (whole repo)';
  let testsClause = '';
  let auditTools = ['Read', 'Glob', 'Grep'];
  if (testCmd) {
    testsClause =
      `, and runtime behavior (you MAY run \`${testCmd}\` via Bash to confirm ` +
      'a claim, but only when a structural check cannot settle it)';
    auditTools = [...auditTools, `Bash(${testCmd})`];
  }

  let clean = 0;
  let totalCost = 0;
  const bar = (ch: string) => ch.repeat(60);

  for (let i = 1; i <= maxIters; i++) {
    console.log(
      colors.audit(
        `\n${bar('=')}\n=== Iteration ${i}: AUDIT (${AUDIT_MODEL}/${AUDIT_EFFORT})\n${bar('=')}`,
      ),
    );

    const audit = await run({
      prompt: AUDIT_PROMPT({ plan, scope, testsClause }),
      model: AUDIT_MODEL,
      effort: AUDIT_EFFORT,
      allowedTools: auditTools,
      permissionMode: 'plan',
    });

    totalCost += audit.cost;

    console.log(
      colorVerdicts(audit.text.trim()) || colors.dim('(no audit output)\n'),
    );
    console.log(
      colors.dim(
        `[audit ${audit.subtype}]  step $${audit.cost.toFixed(4)}  running $${totalCost.toFixed(4)}`,
      ),
    );

    if (audit.subtype !== 'success') {
      console.error(
        errorColors.error(
          `Audit did not complete cleanly (${audit.subtype}); stopping.`,
        ),
      );
      return 1;
    }

    if (verdictIsPass(audit.text)) {
      clean++;

      console.log(colors.ok(`Clean audit (${clean}/${REQUIRED_CLEAN})`));

      if (clean >= REQUIRED_CLEAN) {
        console.log(
          colors.success(
            `\n[+] Converged after ${i} iterations. Total $${totalCost.toFixed(4)}`,
          ),
        );
        return 0;
      }
      continue;
    }

    // FAIL -> fix, then loop back to re-audit
    clean = 0;
    const before = sha(plan);

    console.log(
      colors.fix(
        `\n${bar('-')}\n--- Iteration ${i}: FIX (${FIX_MODEL}/${FIX_EFFORT})\n${bar('-')}`,
      ),
    );

    const fix = await run({
      prompt: FIX_PROMPT({ plan, findings: audit.text }),
      model: FIX_MODEL,
      effort: FIX_EFFORT,
      allowedTools: ['Read', 'Edit', 'Glob', 'Grep'],
      // bypassPermissions: acceptEdits won't auto-approve edits under .claude/,
      // and headless has no one to answer a prompt. Deny Bash to stay bounded.
      permissionMode: 'bypassPermissions',
      disallowedTools: ['Bash'],
    });

    totalCost += fix.cost;

    console.log(fix.text.trim() || colors.dim('(no fix summary)'));
    console.log(
      colors.dim(
        `\n[fix ${fix.subtype}]  step $${fix.cost.toFixed(4)}  running $${totalCost.toFixed(4)}`,
      ),
    );

    if (sha(plan) === before) {
      console.error(
        errorColors.warn('\n[!] The fix step made NO change to the plan file.'),
      );
      console.error(
        errorColors.warn(
          '    Either there was nothing concrete to change, or the fixer',
        ),
      );
      console.error(
        errorColors.warn(
          "    could not apply edits. Stopping so it doesn't spin.",
        ),
      );
      return 1;
    }
    console.log(colors.dim('\n    plan updated -> re-auditing...'));
  }

  console.error(
    errorColors.warn(
      `\n[!] Hit max-iters (${maxIters}) without converging. Total $${totalCost.toFixed(4)}`,
    ),
  );
  return 1;
}

/** One headless call. */
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

async function run({
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
      if (typeof msg.total_cost_usd === 'number') {
        cost = msg.total_cost_usd;
      }
      if (msg.subtype === 'success' && msg.result) {
        text = msg.result;
      }
    }
  }
  return { text, subtype, cost };
}
