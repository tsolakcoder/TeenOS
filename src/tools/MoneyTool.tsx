import React, { useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, Target, DollarSign, PiggyBank } from 'lucide-react';
import { MoneyEntry } from '../types.ts';
import { audioManager } from '../utils/audio.ts';

interface MoneyToolProps {
  entries: MoneyEntry[];
  onAddEntry: (entry: MoneyEntry) => void;
}

export const MoneyTool: React.FC<MoneyToolProps> = ({ entries, onAddEntry }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Snacks & Food');

  const savingsTarget = 120.00;
  const currentSaved = 90.00;

  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalExpense = entries
    .filter(e => e.type === 'expense')
    .reduce((acc, e) => acc + e.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!title.trim() || isNaN(val) || val <= 0) return;

    const newEntry: MoneyEntry = {
      id: `m-${Date.now()}`,
      title: title.trim(),
      amount: val,
      type,
      category,
      date: 'Today'
    };

    onAddEntry(newEntry);
    audioManager.playSuccessChime();
    setTitle('');
    setAmount('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          Teen Stash & Money Management
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simple allowance, gigs, and savings. No trading or crypto hype.
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-tr from-emerald-600 via-teal-700 to-cyan-800 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
          Available Balance
        </span>
        <div className="text-3xl font-black mt-1 font-mono tracking-tight">
          ${balance >= 0 ? balance.toFixed(2) : '0.00'}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-500/40 text-xs">
          <div>
            <span className="text-[10px] text-emerald-200 block">Total In</span>
            <span className="font-extrabold font-mono text-emerald-100">+${totalIncome.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 block">Spent</span>
            <span className="font-extrabold font-mono text-rose-200">-${totalExpense.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-200 block">Savings Target</span>
            <span className="font-extrabold font-mono text-white">${savingsTarget.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Savings Goal Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank size={16} className="text-brand-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Studio Headphones Savings Goal
            </h3>
          </div>
          <span className="text-xs font-black text-brand-600 dark:text-brand-400 font-mono">
            ${currentSaved} / ${savingsTarget}
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(currentSaved / savingsTarget) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400">
          Only $30 to go! 2 more math tutoring sessions.
        </p>
      </div>

      {/* Log Transaction Form */}
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Log Quick Transaction
        </span>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Smoothie with friends, Dog walking"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
          <input
            type="number"
            step="0.25"
            placeholder="$0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-20 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
          />
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold border ${
              type === 'income'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-300 dark:border-emerald-700'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-300 dark:border-rose-700'
            }`}
          >
            <option value="expense">- Expense</option>
            <option value="income">+ Income</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            <option value="Snacks & Food">Snacks & Food</option>
            <option value="Hobbies">Hobbies</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Allowance">Allowance</option>
            <option value="Jobs">Jobs & Chores</option>
          </select>

          <button
            type="submit"
            className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Add
          </button>
        </div>
      </form>

      {/* Transactions History */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          Recent Activity
        </span>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                entry.type === 'income'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
              }`}>
                {entry.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {entry.title}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {entry.date} · {entry.category}
                </span>
              </div>
            </div>

            <span className={`text-xs font-black font-mono ${
              entry.type === 'income' ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'
            }`}>
              {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
