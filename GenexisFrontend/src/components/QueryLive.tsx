import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GOResult } from '../types/GOResult';

export interface PredictionData {
  input: string;
  detected_type: string;
  genexis_go_predictions: GOResult[];
  string: any[];
  kegg: string[];
  clinvar: Record<string, any>;
  pubmed: string[];
}

interface GenexisQueryProps {
  data: PredictionData;
}

export function GenexisQuery({ data }: GenexisQueryProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // --- PDF Generation Logic ---
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Title & Header
    doc.setFontSize(22);
    doc.setTextColor(0, 150, 200); // Cyan-ish color
    doc.text('GeneNova Analysis Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    
    // 2. Input Summary
    doc.setDrawColor(200);
    doc.line(14, 32, pageWidth - 14, 32);
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Input Details:', 14, 40);
    doc.setFontSize(10);
    doc.text(`Input Sequence: ${data.input}`, 14, 46);
    doc.text(`Detected Type: ${data.detected_type}`, 14, 51);

    let finalY = 60; // Track vertical position

    // 3. STRING Data (Table)
    if (data.string && data.string.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 150, 200);
      doc.text('1. STRING Interaction Data', 14, finalY);
      
      const tableData = data.string.map((item: any) => [
        item.partner, 
        typeof item.score === 'number' ? item.score.toFixed(3) : item.score
      ]);

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Partner', 'Score']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [0, 150, 200] },
      });

      // Update Y position after table
      finalY = (doc as any).lastAutoTable.finalY + 15;
    }

    // 4. KEGG Data (List)
    if (data.kegg && data.kegg.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 150, 200);
      doc.text('2. KEGG Pathways', 14, finalY);
      doc.setFontSize(10);
      doc.setTextColor(0);
      
      const keggText = data.kegg.join(', ');
      const splitKegg = doc.splitTextToSize(keggText, pageWidth - 28);
      doc.text(splitKegg, 14, finalY + 8);
      
      finalY += 15 + (splitKegg.length * 5);
    }

    // 5. ClinVar Data (Key-Value)
    if (data.clinvar && Object.keys(data.clinvar).length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 150, 200);
      doc.text('3. ClinVar Data', 14, finalY);
      doc.setFontSize(10);
      doc.setTextColor(0);

      let cvY = finalY + 8;
      Object.entries(data.clinvar).forEach(([key, value]) => {
        const line = `${key}: ${value}`;
        doc.text(line, 14, cvY);
        cvY += 5;
      });
      finalY = cvY + 10;
    }

    // 6. PubMed (Links)
    if (data.pubmed && data.pubmed.length > 0) {
      // Check if we need a new page
      if (finalY > 250) {
        doc.addPage();
        finalY = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 150, 200);
      doc.text('4. PubMed References', 14, finalY);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 255); // Blue links

      let pmY = finalY + 8;
      data.pubmed.forEach((link) => {
        doc.textWithLink(link, 14, pmY, { url: link });
        pmY += 6;
      });
    }

    // Save File
    doc.save('GeneNova_Report.pdf');
  };

  const sections: (keyof PredictionData)[] = ['string', 'kegg', 'clinvar', 'pubmed'];

  const renderContent = (key: keyof PredictionData) => {
    const value = data[key];

    // --- 1. STRING Section ---
    if (key === 'string' && Array.isArray(value)) {
      if (value.length === 0) return <span className="text-sm text-gray-500 italic">No STRING data available.</span>;
      
      return (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {(value as any[]).map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-500 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <span className="text-xs font-semibold text-gray-700 dark:text-cyan-300">
                {item.partner}
              </span>
              <span className="text-xs font-bold text-green-500 dark:text-green-400">
                {typeof item.score === 'number' ? item.score.toFixed(3) : item.score}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // --- 2. PUBMED Section ---
    if (key === 'pubmed' && Array.isArray(value)) {
      if (value.length === 0) return <span className="text-sm text-gray-500 italic">No Pubmed entries found.</span>;
      
      return (
        <div className="flex flex-col gap-2 mt-2">
          {(value as string[]).map((link, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-cyan-500 mt-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </span>
              <a 
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline break-all transition-colors"
              >
                {link}
              </a>
            </div>
          ))}
        </div>
      );
    }

    // --- 3. KEGG Section ---
    if (key === 'kegg' && Array.isArray(value)) {
      if (value.length === 0) return <span className="text-sm text-gray-500 italic">No KEGG data available.</span>;
      
      return (
        <div className="flex flex-wrap gap-2 mt-2">
           {(value as string[]).map((item, idx) => (
             <span 
              key={idx}
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 transition-all duration-500 ${animated ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${idx * 50}ms` }}
             >
               {item}
             </span>
           ))}
        </div>
      );
    }

    // --- 4. CLINVAR/Generic Fallback ---
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const entries = Object.entries(value);
      if (entries.length === 0) return <span className="text-xs text-gray-400 dark:text-gray-500 italic mt-1 block">No data available</span>;
      
      return (
        <div className="space-y-1 mt-2">
          {entries.map(([k, v], idx) => (
             <div key={idx} className="text-xs text-gray-600 dark:text-gray-300 flex gap-2">
               <span className="font-semibold text-gray-700 dark:text-gray-400">{k}:</span>
               <span className="break-all">{String(v)}</span>
             </div>
          ))}
        </div>
      );
    }

    return <div className="text-xs text-gray-400 dark:text-gray-500 italic mt-1">No data available</div>;
  };

  return (
    <div className="glass-card p-6 relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-cyan-400">
            GeneNova Live Query
          </h3>
          {data.input && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Input: <span className="font-mono text-cyan-600 dark:text-cyan-300">{data.input}</span> 
              {data.detected_type && <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] uppercase">{data.detected_type}</span>}
            </p>
          )}
        </div>
        
        {/* PDF Export Button */}
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 rounded-lg shadow transition-colors"
          title="Download PDF Report"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Report
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((sectionKey, index) => {
          if (sectionKey === 'input' || sectionKey === 'detected_type' || sectionKey === 'genexis_go_predictions') return null;

          return (
            <div key={sectionKey} className="group">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                  {sectionKey}
                </span>
              </div>
              <div className="pl-11">
                {renderContent(sectionKey)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}