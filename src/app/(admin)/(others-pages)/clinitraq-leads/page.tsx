
// "use client";

import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SynContactsTable from "@/components/syn-contacts/SynContactsTable";
import CliniContactsTable from "@/components/clinitraq-contacts/CliniContactsTable";

export const metadata: Metadata = {
  title: 'Synergetics | Leads Viewer',
  description: 'Streamlined lead collection for smarter decisions.',
  keywords: ['Next.js', 'React', 'JavaScript'],
  openGraph: {
    title: 'Synergetics | Leads Viewer',
    description: 'Streamlined lead collection for smarter decisions.',
    url: 'https://example.com',
  },
};

export default function ClinitraqLeads() {
  
 
  return (
    <div className="">
      <PageBreadcrumb pageTitle="Clinitraq Leads" />
      <div className="space-y-6">
        <ComponentCard title="Contact Form">
          <CliniContactsTable/>
        </ComponentCard>
      </div>
    </div>
  );
}
