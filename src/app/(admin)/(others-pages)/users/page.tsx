
// "use client";

import type { Metadata } from "next";
import React from "react";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import UsersTable from "@/components/user-listing/UsersTable";


export const metadata: Metadata = {
  title: 'Synergetics | Users',
  description: 'Streamlined lead collection for smarter decisions.',
  keywords: ['Next.js', 'React', 'JavaScript'],
  openGraph: {
    title: 'Synergetics | Leads Viewer',
    description: 'Streamlined lead collection for smarter decisions.',
    url: 'https://example.com',
  },
};


export default function Users() {
 
 
  return (
    <div className="">
      <PageBreadcrumb pageTitle="User List" />
      <div className="space-y-6">
        <ComponentCard title="">
          <UsersTable/>
        </ComponentCard>
      </div>
    </div>
  );
}
