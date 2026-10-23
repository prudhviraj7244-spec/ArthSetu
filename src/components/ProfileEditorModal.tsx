import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Briefcase,
  IndianRupee,
  Shield,
  Target,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import { UserProfile, TierLevel, Occupation, LanguageCode } from '../types';

interface ProfileEditorModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

export const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'basics' | 'expenses' | 'assets' | 'goals'>('basics');

  const handleBasicChange = (field: keyof UserProfile, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleExpenseChange = (field: keyof UserProfile['expenses'], val: number) => {
    setFormData((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, [field]: Number(val) || 0 },
    }));
  };

  const handleSavingsChange = (field: keyof UserProfile['savings'], val: number) => {
    setFormData((prev) => ({
      ...prev,
      savings: { ...prev.savings, [field]: Number(val) || 0 },
    }));
  };

  const handleInvestmentChange = (field: keyof UserProfile['investments'], val: number) => {
    setFormData((prev) => ({
      ...prev,
      investments: { ...prev.investments, [field]: Number(val) || 0 },
    }));
  };

  const handleAddGoal = () => {
    setFormData((prev) => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          id: `goal-${Date.now()}`,
          title: 'New Financial Goal',
          targetAmount: 100000,
          targetYears: 3,
          priority: 'high',
          category: 'education',
        },
      ],
    }));
  };

  const handleRemoveGoal = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  const handleUpdateGoal = (id: string, field: string, val: any) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, [field]: val } : g)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Edit Financial Profile</h3>
            <p className="text-xs text-slate-500">
              Customize income, monthly expenses, debts, and Indian city tier.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 my-4 text-xs font-semibold">
          {[
            { id: 'basics', label: '1. Personal & Income' },
            { id: 'expenses', label: '2. Monthly Expenses' },
            { id: 'assets', label: '3. Savings & Debts' },
            { id: 'goals', label: '4. Financial Goals' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-2 px-3 transition-colors ${
                activeTab === t.id
                  ? 'border-b-2 border-emerald-600 text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TAB 1: Basics */}
          {activeTab === 'basics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleBasicChange('name', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Age</label>
                <input
                  type="number"
                  min="16"
                  max="90"
                  value={formData.age}
                  onChange={(e) => handleBasicChange('age', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Occupation</label>
                <select
                  value={formData.occupation}
                  onChange={(e) => handleBasicChange('occupation', e.target.value as Occupation)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="student">Student</option>
                  <option value="salaried">Salaried Employee</option>
                  <option value="business_owner">Small Business / Kirana</option>
                  <option value="self_employed">Self Employed / Artisan</option>
                  <option value="daily_wage">Daily Wage / Gig Worker</option>
                  <option value="retired">Senior / Retired</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">City & Tier Level</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleBasicChange('city', e.target.value)}
                    placeholder="City name"
                    className="w-2/3 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                  <select
                    value={formData.tier}
                    onChange={(e) => handleBasicChange('tier', e.target.value as TierLevel)}
                    className="w-1/3 p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="Tier-1">Tier-1</option>
                    <option value="Tier-2">Tier-2</option>
                    <option value="Tier-3">Tier-3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Monthly Income / Allowance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleBasicChange('monthlyIncome', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Family Dependents</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={formData.familyDependents}
                  onChange={(e) => handleBasicChange('familyDependents', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Expenses */}
          {activeTab === 'expenses' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Housing & Rent (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.expenses.housingRent}
                  onChange={(e) => handleExpenseChange('housingRent', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Groceries & Food (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.expenses.groceriesFood}
                  onChange={(e) => handleExpenseChange('groceriesFood', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Utilities (Electricity, Water, Gas, WiFi) (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.expenses.utilities}
                  onChange={(e) => handleExpenseChange('utilities', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Education & School Fees (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.expenses.education}
                  onChange={(e) => handleExpenseChange('education', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Healthcare & Medicines (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.expenses.healthcare}
                  onChange={(e) => handleExpenseChange('healthcare', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Transport & Petrol (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.expenses.transport}
                  onChange={(e) => handleExpenseChange('transport', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Total Loan EMIs (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.expenses.loansEmi}
                  onChange={(e) => handleExpenseChange('loansEmi', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-red-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Entertainment & Discretionary (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.expenses.entertainmentDiscretionary}
                  onChange={(e) =>
                    handleExpenseChange('entertainmentDiscretionary', Number(e.target.value))
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Assets & Debts */}
          {activeTab === 'assets' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Liquid Savings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-600 block mb-1">Bank Savings (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.savings.bankSavings}
                      onChange={(e) => handleSavingsChange('bankSavings', Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Fixed Deposits (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.savings.fixedDeposits}
                      onChange={(e) => handleSavingsChange('fixedDeposits', Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Cash in Hand (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.savings.cashInHand}
                      onChange={(e) => handleSavingsChange('cashInHand', Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-800">Investments</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-600 block mb-1">Mutual Funds / SIP (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.investments.mutualFundsSIP}
                      onChange={(e) =>
                        handleInvestmentChange('mutualFundsSIP', Number(e.target.value))
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Gold (Digital/Physical) (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.investments.gold}
                      onChange={(e) => handleInvestmentChange('gold', Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">EPF / PPF (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.investments.epfPpf}
                      onChange={(e) => handleInvestmentChange('epfPpf', Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Goals */}
          {activeTab === 'goals' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Financial Goals</span>
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Goal
                </button>
              </div>

              {formData.goals.map((g) => (
                <div
                  key={g.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(g.id)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    title="Remove goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                    <div className="sm:col-span-2">
                      <label className="text-slate-500 block mb-0.5">Goal Title</label>
                      <input
                        type="text"
                        value={g.title}
                        onChange={(e) => handleUpdateGoal(g.id, 'title', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-0.5">Target Years</label>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={g.targetYears}
                        onChange={(e) =>
                          handleUpdateGoal(g.id, 'targetYears', Number(e.target.value))
                        }
                        className="w-full p-1.5 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 block mb-0.5">Target Amount (₹)</label>
                      <input
                        type="number"
                        min="1000"
                        step="10000"
                        value={g.targetAmount}
                        onChange={(e) =>
                          handleUpdateGoal(g.id, 'targetAmount', Number(e.target.value))
                        }
                        className="w-full p-1.5 bg-white border border-slate-200 rounded-md font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-0.5">Priority</label>
                      <select
                        value={g.priority}
                        onChange={(e) => handleUpdateGoal(g.id, 'priority', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded-md"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Recalculate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
