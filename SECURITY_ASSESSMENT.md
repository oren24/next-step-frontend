# Security Vulnerability Assessment

**Date:** April 5, 2026  
**Status:** ⚠️ Known Issues - Requires Decision

## GitHub's 2 Flagged Vulnerabilities

Both moderate severity vulnerabilities stem from the same root cause:

### Vulnerability: YAML Stack Overflow (GHSA-48c2-rrv3-qjmp)
- **Severity:** Moderate (CVSS 4.3)
- **Affected Package Chain:**
  ```
  @toolpad/core@0.16.0 
    → @toolpad/utils@*
      → yaml@[1.0.0-1.10.2 or 2.0.0-2.8.2]
  ```
- **Root Cause:** The yaml parser is vulnerable to stack overflow when processing deeply nested YAML structures
- **CWE:** CWE-674 (Uncontrolled Recursion)
- **Impact:** DoS attack vector via malicious YAML input

## Why a Direct Fix is Problematic

The available fix requires upgrading @toolpad/core to v0.1.55, which:
- **Is a major version downgrade** (0.16.0 → 0.1.55) 
- **Has incompatibilities** with current setup:
  - Requires React 18 instead of React 19
  - Bundles Next.js which introduces 17 additional critical CVEs
  - Creates peer dependency conflicts
  - Downgrades @mui/material from v7 to v5

## Current Assessment

### Risk Level: **LOW** (for this specific application)
- This is a **frontend-only SPA** (no backend persistence)
- YAML parsing is **not directly exposed** to user input
- YAML is only used internally by @toolpad/core for configuration
- Attack requires: admin/developer control over @toolpad/core configuration files

### Recommended Actions:

1. **Short Term:** 
   - Monitor GitHub for updates to @toolpad/core (latest: 0.16.0)
   - Do NOT apply `npm audit fix --force` (creates more problems)

2. **Medium Term:**
   - Watch for @toolpad/core v0.17.0+ that fixes yaml without major version bump
   - Evaluate if @toolpad/core is still needed (used for: Account component, SignInPage)

3. **Long Term:**
   - Consider if Toolpad core provides enough value to justify maintenance burden
   - Evaluate standalone auth UI alternatives (custom React components)

## Development Workflow Impact

- ✅ Code continues to lint successfully
- ✅ Code continues to build successfully  
- ✅ No functional impact on the application
- ⚠️ GitHub displays security warning (cosmetic only)

## Files Affected by This Assessment
- `package.json` - @toolpad/core@0.16.0
- `package-lock.json` - Dependency tree

---

**Decision Required:** Accept known risk or refactor away from @toolpad/core?

