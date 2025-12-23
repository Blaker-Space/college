import { useMemo } from "react";

export default function useName(user) {
  const name = useMemo(() => {
    const candidates = [
      user?.username,
      user?.fullName,
      user?.primaryEmailAddress?.emailAddress,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string") {
        const trimmed = candidate.trim();
        if (trimmed) return trimmed;
      }
    }

    return "System";
  }, [user]);

  return name;
}
