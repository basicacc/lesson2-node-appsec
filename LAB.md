# Lesson 2 Lab — Build the SCA pipeline


**Goal:** by the end you have a GitHub Actions pipeline that scans your dependencies on every push, **fails** the build on a high/critical vulnerability, and produces an **SBOM**.

This mirrors what you did in Lesson 1 for SAST — same shape, new scanner.

---

## Before you start

1. **Accept the invite** to your `lesson2-node-<username>` repo and clone it.
2. Confirm Actions are enabled: repo → **Actions** tab → enable if prompted.

---

## Checkpoint 1 — Add an SCA scan

You'll use **Trivy**, a general-purpose scanner that reads your `package-lock.json` and checks every component against advisory databases.

1. Create `.github/workflows/sca.yml`.
2. Write a workflow that triggers on `push` and `pull_request`, runs on `ubuntu-latest`, checks out the code, and runs a Trivy filesystem scan. A good starting action:

   ```yaml
   - uses: aquasecurity/trivy-action@0.28.0
     with:
       scan-type: fs
       scan-ref: .
   ```

3. Commit and push. Open the **Actions** tab and confirm Trivy lists vulnerable dependencies in the log — you should see `lodash`, `minimist`, and others.

✅ **Done when:** the workflow runs and the log shows dependency vulnerabilities.

---

## Checkpoint 2 — Gate on severity

Right now the job may pass even with findings. Make it **fail** on serious ones.

1. Configure the Trivy step to fail the build on **HIGH and CRITICAL** vulnerabilities. The relevant inputs are `severity: HIGH,CRITICAL` and `exit-code: 1`.
2. Push. The run should now **fail** — the app has critical dependency CVEs (lodash, minimist).
3. Now **fix one**: bump `lodash` in `package.json` from `4.17.10` to `4.17.21`, run `npm install --package-lock-only` to update the lockfile, and push. That finding should disappear.

✅ **Done when:** you've seen the build go **red on a finding**, and seen a finding **clear after you upgraded** the dependency.

> This is the SCA remediation loop: the fix isn't editing code, it's **upgrading the dependency** to a version outside the vulnerable range.

---

## Checkpoint 3 — Emit an SBOM

Produce an inventory of everything in your dependency tree.

1. Add a step (or configure Trivy) to generate a **CycloneDX** SBOM of your project, written to a file like `sbom.json`. Trivy can do this directly:

   ```bash
   trivy fs --format cyclonedx --output sbom.json .
   ```

   (via the action, set `format: cyclonedx` and `output: sbom.json`)

2. Upload `sbom.json` as a build artifact using `actions/upload-artifact@v4`, with `if: always()` so it's produced even when the gate fails.
3. Push. From the run's **Summary** page, download the `sbom` artifact.

✅ **Done when:** you can download the SBOM artifact from the completed run.

> The SBOM is your instant answer to "are we affected by the next big CVE?" — keep producing it on every run.

---

## What to submit

- A link to your repo (pipeline must run on push).
- A screenshot of a run that went **red on a finding**, and one that **passed after the upgrade**.
- The downloaded **SBOM** artifact (or a screenshot of it in the Artifacts section).

## Stretch goal (if you finish early)

Trivy is a *general* scanner. Try the **native** Node tool too: run `npm audit` in a step and compare what it finds vs. Trivy. Which is easier to read? Which catches more? This previews your homework — where you'll build logic to detect the ecosystem and route to the right scanner across many languages.
