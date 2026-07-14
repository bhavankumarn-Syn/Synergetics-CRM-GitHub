"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import dayjs from "dayjs";
import Pagination from "../tables/Pagination";




interface Contacts {
  id: number;
  name: string;
  email: string;
  phone: string;
  brief: string;
  organization: string;
  createdAt: string;
  form: string;
}


const SynContactsTable = () => {

    const [leads, setLeads] = useState<Contacts[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchOrders = async (page: number, limit: number) => {
        try {
        // const response = await fetch('/api/appuser');
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/forms/syn/contact/all?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
            }} );
        console.log('API response:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('API response:', data);
        setLeads(data?.data || []);
        setTotalPages(data?.meta?.totalPages || 0);
        } catch (error) {
        console.error('Error fetching users:', error);
        }
    }

    useEffect(() => {
        fetchOrders(page, limit);
    }, [page, limit]);
  

  return (
    <>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1102px]">
            <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Name
                    
                    
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Email
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Form
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Organization
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Phone
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Date
                    </TableCell>
                     <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Description
                    </TableCell>
                </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {leads.map((lead) => (
                    <TableRow key={lead.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                         <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {lead.name}
                        </span>
                        
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lead.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                      size="sm"
                      color={
                        lead.form === "CONTACT"
                          ? "success" : "warning"
                      }
                    >
                      {lead.form}
                    </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lead.organization}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lead.phone}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {dayjs(lead.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lead.brief}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            
            </div>
        </div>
        
        </div>
        <div className="flex justify-end px-1">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

    </>
  );
};

export default SynContactsTable;



