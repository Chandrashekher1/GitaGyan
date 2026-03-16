const LOCAL_USER_ID_KEY = "uid";

export function getOrCreateLocalUserId() {
  const existing = localStorage.getItem(LOCAL_USER_ID_KEY);
  if (existing) {
    return existing;
  }

  const generated = `local_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  localStorage.setItem(LOCAL_USER_ID_KEY, generated);
  return generated;
}
