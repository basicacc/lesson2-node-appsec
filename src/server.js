/*
 * vuln-deps-node  —  Lesson 2 (SCA) target.
 *
 * Unlike Lesson 1, the APP CODE here is not the point. The point is the
 * DEPENDENCIES in package.json — they are pinned to versions with known,
 * published CVEs. Your scanner will find them.
 *
 * The one thing worth noting for the REACHABILITY discussion: this app
 * actually CALLS lodash.defaultsDeep() with request data below. That makes
 * the lodash CVE (CVE-2019-10744) not just present, but reachable.
 *
 * Planted vulnerable dependencies (see package.json):
 *   lodash   4.17.10  -> CVE-2019-10744  (prototype pollution, Critical)
 *   minimist 1.2.0    -> CVE-2020-7598   (prototype pollution)
 *   axios    0.21.0   -> CVE-2021-3749   (ReDoS) and others
 *   express  4.17.1   -> older, pulls transitive advisories
 *
 * DO NOT deploy this.
 */

const express = require("express");
const _ = require("lodash");

const app = express();
app.use(express.json());

// Reachable use of the vulnerable lodash function — this is what makes
// CVE-2019-10744 exploitable, not just present. Merges untrusted request body
// into an object using the vulnerable defaultsDeep().
app.post("/merge", (req, res) => {
  const base = { role: "user" };
  const result = _.defaultsDeep(base, req.body); // <-- vulnerable sink
  res.json(result);
});

app.get("/", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("vuln-deps-node on " + PORT));

module.exports = app;
