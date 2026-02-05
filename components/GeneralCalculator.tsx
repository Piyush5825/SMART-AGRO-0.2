
import React, { useState } from 'react';
import { X, Minus, Plus, Equal, Divide } from 'lucide-react';

const marathiNumerals: Record<string, string> = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९', '.': '.'
};

const GeneralCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const currentValue = firstOperand || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setFirstOperand(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return first / second;
      default: return second;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator && firstOperand !== null) {
      const newValue = calculate(firstOperand, inputValue, operator);
      setDisplay(String(newValue));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  const toMarathi = (str: string) => {
    return str.split('').map(char => marathiNumerals[char] || char).join('');
  };

  const Button = ({ onClick, children, className = "", variant = "default" }: any) => {
    const variants: any = {
      default: "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white",
      operator: "bg-orange-100 dark:bg-orange-900/40 hover:bg-orange-200 dark:hover:bg-orange-900/60 text-orange-600 dark:text-orange-400",
      action: "bg-orange-600 hover:bg-orange-700 text-white",
      clear: "bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400"
    };

    return (
      <button 
        onClick={onClick}
        className={`p-4 rounded-xl text-xl font-bold transition shadow-sm border border-gray-100 dark:border-gray-600 flex items-center justify-center ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-colors">
      <h2 className="text-xl font-bold marathi-font mb-6 text-gray-800 dark:text-white text-center">कॅलकुलेटर</h2>
      
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl mb-6 text-right overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700">
        <div className="text-sm text-gray-400 h-6 mb-1 marathi-font">
          {firstOperand !== null ? `${toMarathi(String(firstOperand))} ${operator || ''}` : ''}
        </div>
        <div className="text-4xl font-mono font-bold text-gray-800 dark:text-white truncate">
          {toMarathi(display)}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Button onClick={clear} variant="clear" className="col-span-2 marathi-font font-bold">C (साफ करा)</Button>
        <Button onClick={() => performOperation('/')} variant="operator"><Divide size={24} /></Button>
        <Button onClick={() => performOperation('*')} variant="operator"><X size={24} /></Button>

        {['7', '8', '9'].map(d => <Button key={d} onClick={() => inputDigit(d)}>{marathiNumerals[d]}</Button>)}
        <Button onClick={() => performOperation('-')} variant="operator"><Minus size={24} /></Button>

        {['4', '5', '6'].map(d => <Button key={d} onClick={() => inputDigit(d)}>{marathiNumerals[d]}</Button>)}
        <Button onClick={() => performOperation('+')} variant="operator"><Plus size={24} /></Button>

        {['1', '2', '3'].map(d => <Button key={d} onClick={() => inputDigit(d)}>{marathiNumerals[d]}</Button>)}
        <Button onClick={handleEquals} variant="action" className="row-span-2"><Equal size={24} /></Button>

        <Button onClick={() => inputDigit('0')} className="col-span-2">{marathiNumerals['0']}</Button>
        <Button onClick={inputDecimal}>{marathiNumerals['.']}</Button>
      </div>
    </div>
  );
};

export default GeneralCalculator;
