import React from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const AUTH_ENABLED = process.env.REACT_APP_AUTH_ENABLED === "true";

// Component to handle authentication wrapping
export function Authentication({ children }) {
  // During development
  if (!AUTH_ENABLED) {
    return <>{children}</>;
  }
  // When launched
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
