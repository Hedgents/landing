// Canonical hedged-carry weighting for the hgMETAL hedged vault (hgUSD/hgYIELD).
//
// AUDIT_v2 FE-2/FE-3: the hedged book is gold/silver ONLY, deployed 75/25
// (gold/silver). Pt/Pd are exposure-only in the in-kind index and are NEVER
// shorted, so they contribute no funding carry to the hedged sleeve. This is
// the single source of truth for the hedged carry weights; both the terminal
// and landing /api/hgmetal-vault routes must import this constant so they
// cannot silently diverge.
//
// NOTE: terminal and landing are separate Next.js apps with no shared package,
// so this file is mirrored at terminal/src/lib/hedged-carry.ts. Keep the two
// byte-identical (a diff catches drift). Do NOT reintroduce inline literals.
export const HEDGED_CARRY_W: Record<string, number> = { GOLD: 0.75, SILVER: 0.25 };

// Fee drag (annual %) and hours/year used to annualize HL funding into a
// carry %. Shared so the carry math is identical across surfaces.
export const HEDGED_CARRY_FEES_PCT = 1.5;
export const HRS_PER_YEAR = 24 * 365;
