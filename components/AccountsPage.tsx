import React from 'react';
import { Plus, Check, Info, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface AccountsPageProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ onNext, onPrevious }) => {
  // Mock data for the accounts table matching the screenshot
  const accounts = [
      { 
        id: 1, 
        name: "ROTH IRA", 
        number: "XXXX9977", 
        goal: "RETIREMENT", 
        type: "ROTH IRA\nSelf-Directed", 
        owner: "LORENA", 
        value: 59284.43, 
        contributions: 0 
      },
      { 
        id: 2, 
        name: "INDIVIDUAL - TOD", 
        number: "XXXX7621", 
        goal: "RETIREMENT", 
        type: "INDIVIDUAL - TOD\nFidelity Go", 
        owner: "LORENA", 
        value: 75.10, 
        contributions: 0 
      },
      { 
        id: 3, 
        name: "401K RETIREMENT SAVINGS PLAN", 
        number: "XXXX3321", 
        goal: "RETIREMENT", 
        type: "401K RETIREMENT SAVINGS PLAN", 
        owner: "LORENA", 
        value: 441757.88, 
        contributions: 20500 
      },
      { 
        id: 4, 
        name: "INDIVIDUAL - TOD", 
        number: "XXXX5512", 
        goal: "RETIREMENT", 
        type: "INDIVIDUAL - TOD\nFidelity Go", 
        owner: "LORENA", 
        value: 50.00, 
        contributions: 0 
      },
      { 
        id: 5, 
        name: "INDIVIDUAL - TOD", 
        number: "XXXX0562", 
        goal: "RETIREMENT", 
        type: "INDIVIDUAL - TOD\nSelf-Directed", 
        owner: "LORENA", 
        value: 485742.99, 
        contributions: 0 
      },
      { 
        id: 6, 
        name: "HEALTH SAVINGS ACCOUNT", 
        number: "XXXX8430", 
        goal: "RETIREMENT", 
        type: "HEALTH SAVINGS ACCOUNT\nSelf-Directed", 
        owner: "LORENA", 
        value: 4551.10, 
        contributions: 3500 
      },
      { 
        id: 7, 
        name: "INDIVIDUAL - TOD", 
        number: "XXXX4509", 
        goal: "UNASSIGNED", 
        type: "INDIVIDUAL - TOD\nSelf-Directed", 
        owner: "LORENA", 
        value: 164681.94, 
        contributions: 0 
      },
  ];

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-8 max-w-6xl animate-in fade-in duration-500 flex-1 overflow-y-auto pb-24">
        <div className="mb-8">
            <div className="text-sm text-slate-500 mb-4">Navigation</div>
            <h1 className="text-3xl font-normal text-slate-800 mb-10">Accounts</h1>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 border-l-4 border-l-green-700 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm mb-4">Assigned retirement balance</h3>
                    <div className="text-3xl font-normal text-slate-900 mb-2">$991,461</div>
                    <div className="text-sm text-slate-500">from 6 out of 7 accounts</div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 border-l-4 border-l-green-700 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm mb-4">Retirement contributions</h3>
                    <div className="text-3xl font-normal text-slate-900 mb-2">$24,000<span className="text-lg text-slate-500">/yr</span></div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 border-l-4 border-l-green-700 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 text-sm">Investment tax position</h3>
                        <Info size={14} className="text-slate-400 cursor-help" />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-600">Tax deferred</span>
                                <span className="font-semibold text-slate-800">45%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-slate-500 h-full w-[45%]"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-600">Taxable</span>
                                <span className="font-semibold text-slate-800">49%</span>
                            </div>
                             <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-slate-500 h-full w-[49%]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-600">Tax exempt</span>
                                <span className="font-semibold text-slate-800">6%</span>
                            </div>
                             <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-slate-500 h-full w-[6%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-slate-600 mb-10 text-sm max-w-4xl leading-relaxed">
                Your retirement savings and contributions are critical inputs for your plan. We've automatically included your eligible Fidelity accounts. Please review them and add any outside accounts to get a complete picture of your retirement readiness.
            </p>

            <h2 className="text-lg font-medium text-slate-800 mb-4">Review available accounts</h2>
            
            <div className="flex flex-wrap gap-4 mb-12">
                <button className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2 px-6 rounded-sm transition-colors shadow-sm text-sm">
                    Accounts
                </button>
                <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 px-6 rounded-sm transition-colors shadow-sm text-sm flex items-center gap-2">
                    <Plus size={16} />
                    Add non-Fidelity accounts
                </button>
            </div>

            <div className="border-t border-slate-200 pt-8 max-w-full">
                 <h2 className="text-xl font-medium text-slate-800 mb-2">Your accounts at Fidelity</h2>
                 <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-5xl">
                     This is a list of your accounts at Fidelity. If you would like to update contributions or account assignment you can do so by clicking on Edit.
                 </p>
                 
                 {/* Account Labels Legend */}
                 <div className="mb-6 text-xs text-slate-500 flex flex-wrap gap-y-2 max-w-5xl leading-relaxed">
                     <span className="font-bold text-slate-700 mr-3">Account labels:</span>
                     <span className="mr-5 border-b border-dotted border-slate-400 pb-0.5 cursor-help">(AA) Authorized Account</span>
                     <span className="mr-5 border-b border-dotted border-slate-400 pb-0.5 cursor-help">(EC) Equity compensation</span>
                     <span className="mr-5 border-b border-dotted border-slate-400 pb-0.5 cursor-help">(FV) Full View®</span>
                     <span className="mr-5 border-b border-dotted border-slate-400 pb-0.5 cursor-help">(GB) Goal Booster</span>
                     <span className="mr-5 border-b border-dotted border-slate-400 pb-0.5 cursor-help">(MA) Managed account</span>
                     <span className="mr-5 border-b border-dotted border-slate-400 pb-0.5 cursor-help">(M) Manual</span>
                     <span className="border-b border-dotted border-slate-400 pb-0.5 cursor-help">(RE) Roth eligible</span>
                 </div>
                 
                 {/* Accounts Table */}
                 <div className="overflow-x-auto border border-slate-300 rounded-sm">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-200/50 border-b border-slate-300 h-12">
                                <th className="p-3 pl-4 text-xs font-bold text-slate-700 w-16 align-middle border-r border-slate-300">Edit</th>
                                <th className="p-3 text-xs font-bold text-slate-700 align-middle border-r border-slate-300">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 group">
                                        Account <ChevronsUpDown size={12} className="text-slate-500 group-hover:text-slate-700" />
                                    </div>
                                </th>
                                 <th className="p-3 text-xs font-bold text-slate-700 align-middle border-r border-slate-300 w-48">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 group">
                                        Goal Assignment <ChevronsUpDown size={12} className="text-slate-500 group-hover:text-slate-700" />
                                    </div>
                                </th>
                                 <th className="p-3 text-xs font-bold text-slate-700 align-middle border-r border-slate-300">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 group">
                                        Type <ChevronsUpDown size={12} className="text-slate-500 group-hover:text-slate-700" />
                                    </div>
                                </th>
                                 <th className="p-3 text-xs font-bold text-slate-700 align-middle border-r border-slate-300">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 group">
                                        Owner <ChevronsUpDown size={12} className="text-slate-500 group-hover:text-slate-700" />
                                    </div>
                                </th>
                                 <th className="p-3 pr-4 text-xs font-bold text-slate-700 align-middle border-r border-slate-300">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 group">
                                        Balance <ChevronsUpDown size={12} className="text-slate-500 group-hover:text-slate-700" />
                                    </div>
                                </th>
                                <th className="p-3 pr-4 text-xs font-bold text-slate-700 text-right align-middle">
                                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-slate-900 group">
                                        Contributions <ChevronsUpDown size={12} className="text-slate-500 group-hover:text-slate-700" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((acc, idx) => (
                                <tr key={acc.id} className={`border-b border-slate-300 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-[#f0f6fc]/30' : 'bg-white'}`}>
                                    <td className="p-3 pl-4 align-top pt-4 border-r border-slate-300/50">
                                        <button className="text-sm text-blue-700 hover:underline decoration-dotted underline-offset-2 font-medium">Edit</button>
                                    </td>
                                    <td className="p-3 align-top pt-4 border-r border-slate-300/50">
                                        <div className="font-bold text-slate-800 text-sm">{acc.name}</div>
                                        <div className="text-xs text-slate-500 font-normal mt-0.5">{acc.number}</div>
                                    </td>
                                    <td className="p-3 align-top pt-3 border-r border-slate-300/50">
                                        <div className="relative inline-block w-full">
                                            <select className="w-full appearance-none bg-white border border-slate-400 hover:border-slate-500 text-slate-700 py-1.5 px-3 pr-8 rounded-[3px] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer uppercase">
                                                <option>{acc.goal}</option>
                                                {acc.goal !== "RETIREMENT" && <option>RETIREMENT</option>}
                                                {acc.goal !== "UNASSIGNED" && <option>UNASSIGNED</option>}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                                                <ChevronDown size={14} strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 align-top pt-4 border-r border-slate-300/50">
                                        <div className="text-xs font-bold text-slate-700 whitespace-pre-line leading-relaxed uppercase">{acc.type}</div>
                                    </td>
                                    <td className="p-3 align-top pt-4 border-r border-slate-300/50">
                                        <div className="text-xs text-slate-600 uppercase font-medium">{acc.owner}</div>
                                    </td>
                                    <td className="p-3 pr-4 align-top pt-4 border-r border-slate-300/50">
                                        <div className="font-bold text-slate-800 text-sm">${acc.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">As of 12/11/25</div>
                                    </td>
                                    <td className="p-3 pr-4 align-top text-right pt-4">
                                        <div className="font-medium text-slate-800 text-sm">${acc.contributions.toLocaleString()}/yr.</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
      </div>

       {/* Footer */}
       <div className="border-t border-slate-200 p-4 bg-white flex justify-between sticky bottom-0 z-20">
             <button onClick={onPrevious} className="text-slate-600 font-bold py-2 px-8 hover:bg-slate-50 rounded-full transition-colors text-sm">
                Previous
            </button>
             <button onClick={onNext} className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2 px-8 rounded-full transition-colors shadow-sm text-sm">
                Next
            </button>
        </div>
    </div>
  );
};

export default AccountsPage;