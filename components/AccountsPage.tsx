import React, { useState } from 'react';
import { Plus, Check, Info, ChevronDown, ChevronsUpDown, X } from 'lucide-react';
import { AppData, Account } from '../types';

interface AccountsPageProps {
  data: AppData;
  updateData: (updates: Partial<AppData>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ data, updateData, onNext, onPrevious }) => {
  const { accounts } = data;
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [editValues, setEditValues] = useState<{
      name: string;
      number: string;
      goal: string;
      type: string;
      owner: string;
      value: string;
      contributions: string;
  }>({ name: '', number: '', goal: '', type: '', owner: '', value: '', contributions: '' });

  const totalBalance = accounts
    .filter(a => a.goal === 'RETIREMENT')
    .reduce((sum, a) => sum + a.value, 0);

  const totalContributions = accounts
    .filter(a => a.goal === 'RETIREMENT')
    .reduce((sum, a) => sum + a.contributions, 0);

  const handleEditClick = (acc: Account) => {
    setEditingId(acc.id);
    setEditValues({
      name: acc.name,
      number: acc.number,
      goal: acc.goal,
      type: acc.type,
      owner: acc.owner,
      value: acc.value.toString(),
      contributions: acc.contributions.toString()
    });
  };

  const handleSaveClick = (id: number) => {
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === id) {
        return {
          ...acc,
          goal: editValues.goal,
          contributions: parseFloat(editValues.contributions.replace(/,/g, '')) || 0,
          // Only update other fields if outside account
          ...(acc.isOutside ? {
             name: editValues.name,
             number: editValues.number,
             type: editValues.type,
             owner: editValues.owner,
             value: parseFloat(editValues.value.replace(/,/g, '')) || 0,
          } : {})
        };
      }
      return acc;
    });

    updateData({ accounts: updatedAccounts });
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleAddOutsideAccount = () => {
      const maxId = Math.max(...accounts.map(a => a.id), 0);
      const newId = maxId + 1;
      
      const newAccount: Account = {
          id: newId,
          name: "MANUAL ACCOUNT",
          number: "XXXX",
          goal: "UNASSIGNED",
          type: "MANUAL",
          owner: "RICH",
          value: 0,
          contributions: 0,
          isOutside: true
      };
      
      updateData({ accounts: [...accounts, newAccount] });
      
      // Auto-edit the new account
      setEditingId(newId);
      setEditValues({
          name: newAccount.name,
          number: newAccount.number,
          goal: newAccount.goal,
          type: newAccount.type,
          owner: newAccount.owner,
          value: newAccount.value.toString(),
          contributions: newAccount.contributions.toString()
      });
  };

  const renderTable = (data: Account[], isOutside: boolean) => (
      <div className="overflow-x-auto border border-slate-300 rounded-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
             <thead>
                <tr className="bg-slate-200/50 border-b border-slate-300 h-12">
                    <th className="p-3 pl-4 text-xs font-bold text-slate-700 w-24 align-middle border-r border-slate-300">Edit</th>
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
                {data.map((acc, idx) => {
                    const isEditing = editingId === acc.id;
                    return (
                    <tr key={acc.id} className={`border-b border-slate-300 transition-colors ${idx % 2 === 0 ? 'bg-[#f0f6fc]/30' : 'bg-white'} ${isEditing ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                        <td className="p-3 pl-4 align-top pt-4 border-r border-slate-300/50">
                            {isEditing ? (
                                <div className="flex flex-col gap-1 items-start">
                                    <button 
                                        onClick={() => handleSaveClick(acc.id)}
                                        className="text-xs text-white bg-green-700 hover:bg-green-800 px-3 py-1 rounded-sm font-bold shadow-sm"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={handleCancelClick}
                                        className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1 font-medium flex items-center gap-1"
                                    >
                                        <X size={12} /> Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleEditClick(acc)}
                                    className="text-sm text-blue-700 hover:underline decoration-dotted underline-offset-2 font-medium"
                                >
                                    Edit
                                </button>
                            )}
                        </td>
                        <td className="p-3 align-top pt-4 border-r border-slate-300/50">
                            {isEditing && isOutside ? (
                                <div className="flex flex-col gap-2">
                                     <input 
                                        type="text"
                                        value={editValues.name}
                                        onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                                        className="w-full border border-blue-500 rounded-sm py-1 px-2 text-xs font-bold text-slate-800 focus:outline-none ring-1 ring-blue-500"
                                        placeholder="Account Name"
                                    />
                                    <input 
                                        type="text"
                                        value={editValues.number}
                                        onChange={(e) => setEditValues({...editValues, number: e.target.value})}
                                        className="w-full border border-blue-500 rounded-sm py-1 px-2 text-xs text-slate-500 focus:outline-none ring-1 ring-blue-500"
                                        placeholder="Account Number"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="font-bold text-slate-800 text-sm">{acc.name}</div>
                                    <div className="text-xs text-slate-500 font-normal mt-0.5">{acc.number}</div>
                                </>
                            )}
                        </td>
                        <td className="p-3 align-top pt-3 border-r border-slate-300/50">
                            <div className="relative inline-block w-full">
                                <select 
                                    disabled={!isEditing}
                                    value={isEditing ? editValues.goal : acc.goal}
                                    onChange={(e) => setEditValues({...editValues, goal: e.target.value})}
                                    className={`w-full appearance-none border text-slate-700 py-1.5 px-3 pr-8 rounded-[3px] text-xs font-medium focus:outline-none shadow-sm cursor-pointer uppercase ${isEditing ? 'bg-white border-blue-500 ring-1 ring-blue-500' : 'bg-transparent border-slate-300 hover:border-slate-400'}`}
                                >
                                    <option value="RETIREMENT">RETIREMENT</option>
                                    <option value="UNASSIGNED">UNASSIGNED</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                                    <ChevronDown size={14} strokeWidth={1.5} />
                                </div>
                            </div>
                        </td>
                        <td className="p-3 align-top pt-4 border-r border-slate-300/50">
                            {isEditing && isOutside ? (
                                <textarea
                                    value={editValues.type}
                                    onChange={(e) => setEditValues({...editValues, type: e.target.value})}
                                    className="w-full border border-blue-500 rounded-sm py-1 px-2 text-xs font-bold text-slate-700 uppercase focus:outline-none ring-1 ring-blue-500 min-h-[40px] resize-none leading-relaxed"
                                />
                            ) : (
                                <div className="text-xs font-bold text-slate-700 whitespace-pre-line leading-relaxed uppercase">{acc.type}</div>
                            )}
                        </td>
                        <td className="p-3 align-top pt-4 border-r border-slate-300/50">
                             {isEditing && isOutside ? (
                                <input 
                                    type="text"
                                    value={editValues.owner}
                                    onChange={(e) => setEditValues({...editValues, owner: e.target.value})}
                                    className="w-full border border-blue-500 rounded-sm py-1 px-2 text-xs text-slate-600 uppercase font-medium focus:outline-none ring-1 ring-blue-500"
                                />
                            ) : (
                                <div className="text-xs text-slate-600 uppercase font-medium">{acc.owner}</div>
                            )}
                        </td>
                        <td className="p-3 pr-4 align-top pt-4 border-r border-slate-300/50">
                             {isEditing && isOutside ? (
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-slate-500 text-xs">$</span>
                                    <input 
                                        type="text"
                                        value={editValues.value}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[0-9,.]*$/.test(val)) {
                                                setEditValues({...editValues, value: val});
                                            }
                                        }}
                                        className="w-full border border-blue-500 rounded-sm py-1 pl-5 pr-2 text-xs font-bold text-slate-800 focus:outline-none ring-1 ring-blue-500"
                                    />
                                    <div className="text-[10px] text-slate-500 mt-1">As of Today</div>
                                </div>
                            ) : (
                                <>
                                    <div className="font-bold text-slate-800 text-sm">${acc.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">As of 12/11/25</div>
                                </>
                            )}
                        </td>
                        <td className="p-3 pr-4 align-top text-right pt-4">
                            {isEditing ? (
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-slate-500 text-xs">$</span>
                                    <input 
                                        type="text"
                                        value={editValues.contributions}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[0-9,]*$/.test(val)) {
                                                setEditValues({...editValues, contributions: val});
                                            }
                                        }}
                                        className="w-full border border-blue-500 rounded-sm py-1 pl-5 pr-2 text-xs font-medium text-right focus:outline-none ring-1 ring-blue-500"
                                    />
                                </div>
                            ) : (
                                <div className="font-medium text-slate-800 text-sm">${acc.contributions.toLocaleString()}/yr.</div>
                            )}
                        </td>
                    </tr>
                )})}
            </tbody>
        </table>
      </div>
  );

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
                    <div className="text-3xl font-normal text-slate-900 mb-2">${totalBalance.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    <div className="text-sm text-slate-500">from {accounts.filter(a => a.goal === 'RETIREMENT').length} out of {accounts.length} accounts</div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 border-l-4 border-l-green-700 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm mb-4">Retirement contributions</h3>
                    <div className="text-3xl font-normal text-slate-900 mb-2">${totalContributions.toLocaleString(undefined, {maximumFractionDigits: 0})}<span className="text-lg text-slate-500">/yr</span></div>
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

            <div className="border-t border-slate-200 pt-8 max-w-full">
                 <h2 className="text-xl font-medium text-slate-800 mb-2">Your accounts at Fidelity</h2>
                 <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-5xl">
                     This is a list of your accounts at Fidelity. If you would like to update contributions or account assignment you can do so by clicking on Edit.
                 </p>
                 
                 {renderTable(accounts.filter(a => !a.isOutside), false)}
            </div>

            {/* Accounts outside of Fidelity */}
            <div className="border-t border-slate-200 pt-8 mt-12 max-w-full">
                 <div className="flex justify-between items-center mb-2">
                     <h2 className="text-xl font-medium text-slate-800">Accounts outside of Fidelity</h2>
                     <button onClick={handleAddOutsideAccount} className="border border-slate-800 text-slate-800 hover:bg-slate-50 font-bold py-1.5 px-4 rounded-full text-sm transition-colors">
                        Add an account
                     </button>
                 </div>
                 <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                     These are all of the non-Fidelity accounts that you've told us about.
                 </p>
                 
                 {accounts.filter(a => a.isOutside).length === 0 ? (
                     <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 mb-4">
                         <p className="font-bold text-slate-700 text-sm">
                            You haven't linked or included any non-Fidelity accounts yet.
                         </p>
                     </div>
                 ) : (
                     <div className="mb-4">
                        {renderTable(accounts.filter(a => a.isOutside), true)}
                     </div>
                 )}

                 <p className="text-[10px] text-slate-500 leading-relaxed max-w-5xl">
                    When you link an outside account, the data for that account is retrieved from the other financial institution. You may be required to update your login credentials periodically. If you manually add an account, you must update the account value yourself.
                 </p>
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