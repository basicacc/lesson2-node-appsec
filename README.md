# vuln-deps-node

A **deliberately vulnerable** Node/Express app for the AppSec & DevSecOps course, Lesson 2 (SCA).

> ⚠️ **Do not deploy this.** The application code is harmless — the point is the **dependencies** in `package.json`, which are pinned to versions with known, published CVEs. Your scanner will find them.

## What this is for

In Lesson 1 you scanned the code *you wrote* (SAST). Now you scan the code you *pulled in* (SCA). This app installs packages with real known vulnerabilities so you can point a Software Composition Analysis scanner at it and watch it report them.

## Run it locally (optional)

You don't need to run it — SCA reads your manifest and lockfile, it doesn't execute the app. But if you want to:

```bash
npm install
npm start
```

## The planted vulnerable dependencies

See `package.json`. Notably `lodash@4.17.10` carries **CVE-2019-10744** (prototype pollution, Critical) — and `src/server.js` actually *calls* the vulnerable `defaultsDeep()` function, which is what makes it **reachable**, not just present. That's your reachability talking point.

## Lab

Follow `LAB.md`. You will build the SCA pipeline from scratch — the repo has no `.github/` folder.
