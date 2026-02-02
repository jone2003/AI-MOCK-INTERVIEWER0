import React from "react";
import "../globals.css";
import Header from "./_components/Headear";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function DashboardLayout({ children }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div>
      <Header />
      <div className="mx-5 md:mx-20 lg:mx-36">{children}</div>
    </div>
  );
}

export default DashboardLayout;
