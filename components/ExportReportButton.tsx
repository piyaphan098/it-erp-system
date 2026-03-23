"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, Table as TableIcon, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ExportReportButton({ 
  data, 
  filename = "Dashboard_Report",
  dict
}: { 
  data: any[], 
  filename?: string,
  dict: any
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    setIsOpen(false);
  };

  const exportExcel = () => {
    if (!data || data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    setIsOpen(false);
  };

  const exportPDF = () => {
    if (!data || data.length === 0) return;
    const doc = new jsPDF();
    doc.text(`Report: ${filename}`, 14, 15);
    
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => Object.values(obj).map(val => String(val || "")));
    
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      styles: { font: "helvetica" } // Fallback to built-in for English numbers and texts
    });
    
    doc.save(`${filename}.pdf`);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        {dict.exportReport || "Export Report"}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 border border-gray-200 dark:border-gray-700">
          <div className="py-1" role="menu">
            <button
              onClick={exportPDF}
              className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <FileText className="mr-3 h-4 w-4 text-red-500" />
              Export as PDF
            </button>
            <button
              onClick={exportExcel}
              className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <FileSpreadsheet className="mr-3 h-4 w-4 text-green-600" />
              Export as Excel
            </button>
            <button
              onClick={exportCSV}
              className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
               <TableIcon className="mr-3 h-4 w-4 text-blue-500" />
              Export as CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
