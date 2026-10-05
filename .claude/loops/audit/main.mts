import {
  AUDIT_EFFORT,
  AUDIT_MODEL,
  FIX_EFFORT,
  FIX_MODEL,
  REQUIRED_CLEAN,
} from './constants.mts';
import { run } from './run.mts';
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

type AuditPromptArgs = {
  plan: string;
  scope: string;
  testsClause: string;
};

type FixPromptArgs = {
  plan: string;
  findings: string;
};

const AUDIT_PROMPT = ({ plan, scope, testsClause }: AuditPromptArgs) => `\
You are a skeptical staff engineer reviewing an implementation plan that another
agent will execute. ASSUME the plan contains incorrect assumptions until you have
verified otherwise against the actual codebase.

The plan is at: ${plan}
Restrict your investigation to these paths (read/grep only what you need here):
${scope}

For every assumption the plan makes about existing code -- function signatures,
exported symbols, file locations, data shapes${testsClause} -- VERIFY it by reading
the relevant files or grepping. Do not speculate, and do not read files outside the
scoped paths unless a scoped file directly references them.

Report ONLY issues you can back with concrete evidence. For each, give:
  - the plan's claim
  - the contradicting evidence (file:line or grep result)
  - the concrete fix

Be efficient: read the plan once, verify the specific claims, then decide. Do not
re-read files you have already seen.

Put all of your explanation and findings ABOVE the verdict. Then finish with a
single final line that is EXACTLY one of the following, with no other text on that
line (no parentheses, no commentary):
VERDICT: PASS
VERDICT: FAIL
`;

const FIX_PROMPT = ({ plan, findings }: FixPromptArgs) => `\
Revise the implementation plan at ${plan} to resolve every issue in the audit
findings below. Edit the file in place. Preserve its structure and intent; change
only what the findings require, and update any downstream steps that depended on a
corrected assumption. Do not add unrelated content. Do not mark anything resolved
that you did not actually change.

When done, briefly summarize what you changed.

Audit findings:
${findings}
`;

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
