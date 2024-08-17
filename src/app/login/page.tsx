"use client";
import React from "react";
import { signIn } from "next-auth/react";

export default function page() {
  return (
    <div>
      <button onClick={() => signIn("google")}>Login</button>
    </div>
  );
}
