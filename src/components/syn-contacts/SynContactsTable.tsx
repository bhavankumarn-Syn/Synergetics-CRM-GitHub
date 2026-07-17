"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  EyeIcon,
  EyeCloseIcon
} from "../../icons/index";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import dayjs from "dayjs";
import Pagination from "../tables/Pagination";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Select from "../form/Select";




interface Contacts {
  id: number;
  name: string;
  email: string;
  phone: string;
  brief: string;
  organization: string;
  createdAt: string;
  form: string;
  leadType: string
}


const SynContactsTable = () => {
    const [loading, setLoading] = useState(false);
    const [leads, setLeads] = useState<Contacts[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState<string>('');

    const { isOpen, openModal, closeModal } = useModal();
    const [viewLead, setViewLead] = useState({
        form: '',
        name: '',
        email: '',
        organization: '',
        phone: '',
        brief: '',
        leadType: '', 
    })
    const filterOptions = [
      {'label' : 'All', 'value' : 'ALL'},
      {'label' : 'Spam', 'value' : 'SPAM'},
      {'label' : 'Valid', 'value' : 'VALID'}
    ]

    const fetchOrders = async (page: number, limit: number, leadType?: string) => {
        try {
            setLoading(true);
        // const response = await fetch('/api/appuser');
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/forms/syn/contact/all?page=${page}&limit=${limit}&leadType=${leadType}`, {
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
        }finally {
            setLoading(false);
        }
    }

    const viewRecords = (data:any)=>{
        console.log('Data',  data)
        setViewLead({
            form: data.form,
            name: data.name,
            email: data.email,
            organization: data.organization,
            phone: data.phone,
            brief: data.brief,
            leadType: data.leadType, 
        })
        openModal()
    }
    const handleFilterChange = (value: string) => {
      console.log("Selected value:", value);
      setFilter(value)
      fetchOrders(1, limit, value);
      setPage(1)
      // setLimit(10)
    };

    useEffect(() => {
        fetchOrders(page, limit, filter);
    }, [page, limit]);
  

  return (
    <>  
        <div className="relative p-0 m-0">
          <div className=" absolute top-[-75px] right-0 text-amber-300"> 
              <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-2">
                <div className="flex items-center justify-end">
                  <Label className="text-orange-400 mb-0 ">Filter</Label> 
                </div>
                <div>
                  <Select 
                    options={filterOptions} 
                    onChange={handleFilterChange}
                    defaultValue={"ALL"}
                  />
                 
                </div>
              </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
        
        <div className="max-w-full overflow-x-auto">
            {loading ? (
                <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
            <div className="min-w-[1102px]">
            <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-blue-100 dark:border-white/[0.05]">
                <TableRow>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-blue-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Name
                    
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-blue-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Email
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-blue-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Form
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-blue-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Organization
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-blue-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Tag
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-blue-500 text-start text-theme-xs dark:text-gray-400"
                    >
                    Date
                    </TableCell>
                     <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-blue-500 text-start text-theme-xs dark:text-gray-400"
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
                        
                        <Badge
                      size="sm"
                      color={
                        lead.leadType === "SPAM"
                          ? "error"
                          : lead.leadType === "VALID"
                          ? "success"
                          : "warning"
                      }
                    >
                        {lead.leadType}
                    </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {dayjs(lead.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {/* {lead.brief} */}
                       <span className=" cursor-pointer" onClick={()=>viewRecords(lead)}> <EyeIcon/> </span>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            
            </div>) }
        </div>
        
        </div>
        <div className="flex justify-end px-1">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Lead Viewer
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-2">
                <div>
                  <Label className="text-orange-400">Form</Label>
                  <span>{viewLead.form}</span>
                </div>

                <div>
                  <Label className="text-orange-400">Name</Label>
                  <span>{viewLead.name}</span>
                </div>

                <div>
                  <Label className="text-orange-400">Email</Label>
                  <span>{viewLead.email}</span>
                </div>

                <div>
                  <Label className="text-orange-400">Organization</Label>
                  <span>{viewLead.organization}</span>
                </div>

                <div>
                  <Label className="text-orange-400">Phone</Label>
                  <span>{viewLead.phone}</span>
                </div>

                <div>
                  <Label className="text-orange-400">LeadType (valid or spam)</Label>
                  <span>{viewLead.leadType}</span>
                </div>

                <div className="col-span-full">
                  <Label className="text-orange-400">Brief</Label>
                  <span>{viewLead.brief}</span>
                </div>

              </div>
            </div>
            
          </form>
        </div>
      </Modal>

    </>
  );
};

export default SynContactsTable;



