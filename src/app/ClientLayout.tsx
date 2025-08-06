"use client";

import { SessionProvider } from "next-auth/react";
// import { Session } from "next-auth";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  session: any;
};

export default function ClientLayout({ children, session }: Props) {
  const [customSession, setCustomSession] = useState<any>(session);

  useEffect(() => {
    async function fetchData() {
      // Simulate fetching custom data
      const fetchedData = {
        name: "The Bombay Forum",
        description: "Get your daily dose of news from The Bombay Forum",
      };

      // Add custom data to the session
      setCustomSession((prevSession: any) => {
        if (prevSession) {
          return { ...prevSession, userDetails: fetchedData };
        }
        return prevSession;
      });
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  return (
    <SessionProvider session={customSession}>
      {children}
    </SessionProvider>
  );
}
