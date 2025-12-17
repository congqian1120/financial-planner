import React from 'react';

interface RetirementIncomeProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

const RetirementIncome: React.FC<RetirementIncomeProps> = ({ onNext, onPrevious }) => {
  return (
    <div className="flex flex-col h-full relative">
      <div className="p-8 max-w-6xl animate-in fade-in duration-500 flex-1 overflow-y-auto pb-24">
        <div className="mb-8">
            <div className="text-sm text-slate-500 mb-4">Navigation</div>
            <h1 className="text-3xl font-normal text-slate-800 mb-10">Retirement income</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 border-l-4 border-l-green-700 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm mb-4">Lifetime income</h3>
                    <div className="text-3xl font-normal text-slate-900 mb-2">$2,083<span className="text-lg text-slate-500">/mo</span></div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 border-l-4 border-l-green-700 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm mb-4">Other recurring income</h3>
                    <div className="text-3xl font-normal text-slate-900 mb-2">$0<span className="text-lg text-slate-500">/mo</span></div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 border-l-4 border-l-green-700 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm mb-4">One-time income</h3>
                    <div className="text-3xl font-normal text-slate-900 mb-2">$0</div>
                </div>
            </div>

            <p className="text-slate-600 text-sm mb-6 max-w-4xl leading-relaxed">
                These sources of income may not begin at retirement. Also, note that this tool doesn't include withdrawals from savings.
            </p>

            <button className="text-blue-700 font-bold text-sm hover:underline decoration-1 underline-offset-2 mb-12">
                Include or exclude income sources
            </button>

            {/* Lifetime Income Section */}
            <div className="mb-12">
                <h2 className="text-xl font-medium text-slate-800 mb-2">Lifetime income</h2>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-4xl">
                    Think of lifetime income as a reliable source of income that tends not to fluctuate based on market ups and downs. Many people suggest using this type of income as a way to cover essential expenses in retirement.
                </p>

                {/* Social Security Table */}
                <div className="mb-8">
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Social Security</h3>
                    
                    <div className="border border-slate-200 rounded-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100/50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-700 w-24">Edit</th>
                                    <th className="p-4 text-xs font-bold text-slate-700">Name</th>
                                    <th className="p-4 text-xs font-bold text-slate-700">Include</th>
                                    <th className="p-4 text-xs font-bold text-slate-700">Amount</th>
                                    <th className="p-4 text-xs font-bold text-slate-700">Start age</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b border-slate-200">
                                    <td className="p-4">
                                        <button className="text-sm text-blue-700 hover:underline decoration-dotted underline-offset-2 font-medium">Edit</button>
                                    </td>
                                    <td className="p-4 text-sm text-slate-800 font-medium">
                                        Social Security
                                        <div className="text-xs text-slate-500 font-normal mt-0.5">RICH</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-800">Yes</td>
                                    <td className="p-4 text-sm text-slate-800 font-bold">$2,083/mo</td>
                                    <td className="p-4 text-sm text-slate-800">67</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pension Section */}
                 <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="font-bold text-slate-800 text-sm">Pension</h3>
                         <button className="border border-slate-800 text-slate-800 hover:bg-slate-50 font-bold py-1.5 px-4 rounded-full text-xs transition-colors">
                            Add pension
                         </button>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
                        <p className="font-bold text-slate-700 text-sm">
                           You haven't included any pensions yet.
                        </p>
                    </div>
                </div>

                {/* Annuity Section */}
                 <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="font-bold text-slate-800 text-sm">Annuity income</h3>
                         <button className="border border-slate-800 text-slate-800 hover:bg-slate-50 font-bold py-1.5 px-4 rounded-full text-xs transition-colors">
                            Add annuity
                         </button>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
                        <p className="font-bold text-slate-700 text-sm">
                           You haven't included any annuities yet.
                        </p>
                    </div>
                </div>
            </div>

             {/* Other Recurring Income Section */}
            <div className="mb-12 border-t border-slate-200 pt-8">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-medium text-slate-800">Other recurring income</h2>
                     <button className="border border-slate-800 text-slate-800 hover:bg-slate-50 font-bold py-1.5 px-4 rounded-full text-sm transition-colors">
                        Add income
                     </button>
                </div>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-4xl">
                    This includes things like rental real estate income, alimony, or any other income you receive on a regular basis.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
                    <p className="font-bold text-slate-700 text-sm">
                        You haven't included any other recurring income yet.
                    </p>
                </div>
            </div>

             {/* One-time Income Section */}
            <div className="mb-12 border-t border-slate-200 pt-8">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-medium text-slate-800">One-time income</h2>
                     <button className="border border-slate-800 text-slate-800 hover:bg-slate-50 font-bold py-1.5 px-4 rounded-full text-sm transition-colors">
                        Add income
                     </button>
                </div>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-4xl">
                    This covers one-time events like the sale of a property or business, an inheritance, or a lump sum distribution.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
                    <p className="font-bold text-slate-700 text-sm">
                        You haven't included any one-time income yet.
                    </p>
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

export default RetirementIncome;