import React from 'react';
import { ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-normal text-slate-900 mb-2">Retirement</h1>
      <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
        This Retirement Planning tool provides calculations that are hypothetical in nature and do not reflect the actual investment results or guarantee future results.
        <a href="#" className="inline-flex items-center text-blue-700 hover:underline ml-1 font-medium">
          Learn more <ExternalLink size={14} className="ml-1" />
        </a>
      </p>
    </div>
  );
};

export default Header;