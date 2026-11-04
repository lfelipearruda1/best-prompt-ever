import { describe, expect, it } from "vitest";
import { isExpired } from "./session";

describe("isExpired", () => {
  it("keeps a fresh session", () => {
    const now = new Date("2026-01-01T10:00:00Z");
    expect(isExpired({ userId: "u1", lastSeenAt: new Date("2026-01-01T09:50:00Z") }, now)).toBe(false);
  });
});
