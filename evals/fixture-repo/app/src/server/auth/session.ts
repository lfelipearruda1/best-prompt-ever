export type Session = { userId: string; lastSeenAt: Date };

const SESSION_TTL_MINUTES = 30;

export function isExpired(session: Session, now: Date = new Date()): boolean {
  const ageMinutes = (now.getTime() - session.lastSeenAt.getTime()) / 60000;
  return ageMinutes >= SESSION_TTL_MINUTES - 1;
}
