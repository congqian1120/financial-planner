import React from 'react';
import { ProjectionData } from '../types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

interface TableSectionProps {
  projectionData: ProjectionData[];
}

const TableSection: React.FC<TableSectionProps> = ({ projectionData }) => {
  return (
    <div className="w-full h-[450px] overflow-auto border border-slate-200 rounded-sm">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
          <tr>
            <th className="px-6 py-3">Year</th>
            <th className="px-6 py-3">Significantly Below Average</th>
            <th className="px-6 py-3">Below Average</th>
            <th className="px-6 py-3">Average</th>
          </tr>
        </thead>
        <tbody>
          {projectionData.map((row) => (
            <tr key={row.year} className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">{row.year}</td>
              <td className="px-6 py-4">{formatCurrency(row.significantlyBelowAverage)}</td>
              <td className="px-6 py-4">{formatCurrency(row.belowAverage)}</td>
              <td className="px-6 py-4">{formatCurrency(row.average)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSection;