import React from 'react';

// Button Variants
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-bold rounded-xl transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/30',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900 border border-gray-200',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ hoverable = false, interactive = false, className, children, ...props }) => {
  const styles = `bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
    hoverable ? 'hover:shadow-lg hover:border-indigo-200' : ''
  } ${interactive ? 'cursor-pointer' : ''} ${className}`;

  return (
    <div className={styles} {...props}>
      {children}
    </div>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          className={`w-full rounded-xl border-2 transition-all duration-200 outline-none focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-500/10 ${
            error ? 'border-rose-300 bg-rose-50' : 'border-gray-200 bg-white'
          } ${icon ? 'pl-12 pr-4' : 'px-4'} py-3 font-medium ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
};

// Badge Component
type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', size = 'md', children }) => {
  const variantStyles = {
    primary: 'bg-indigo-100 text-indigo-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-blue-100 text-blue-700'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-bold ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};

// Loading Skeleton
interface SkeletonProps {
  width?: string;
  height?: string;
  count?: number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  count = 1,
  circle = false
}) => {
  return (
    <div className="space-y-3">
      {Array(count).fill(null).map((_, i) => (
        <div
          key={i}
          className={`bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse ${
            circle ? 'rounded-full' : 'rounded-xl'
          }`}
          style={{ width, height }}
        />
      ))}
    </div>
  );
};

// Empty State
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="py-16 px-8 text-center">
      {icon && <div className="mb-4 flex justify-center text-5xl opacity-50">{icon}</div>}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

// Alert Component
type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ'
  };

  return (
    <div className={`border rounded-xl p-4 ${variantStyles[variant]} flex items-start gap-3`}>
      <span className="font-bold text-lg flex-shrink-0">{icons[variant]}</span>
      <div className="flex-1">
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 font-bold opacity-70 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Stat Card
interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon }) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-black text-gray-900">{value}</p>
        </div>
        {icon && <div className="text-3xl opacity-20">{icon}</div>}
      </div>
      {change !== undefined && (
        <div className={`text-xs font-bold ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {change >= 0 ? '+' : ''}{change}% from last period
        </div>
      )}
    </Card>
  );
};

// Form Group
interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className, ...props }) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {children}
  </div>
);

// Modal/Dialog
interface DialogProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  children,
  onClose,
  actions
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
        <Card className="w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
          {actions && (
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              {actions}
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

// Tabs
interface TabProps {
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabProps[];
  activeTab: number;
  onTabChange: (index: number) => void;
  children: React.ReactNode[];
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <div>
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`px-6 py-4 font-bold whitespace-nowrap transition-all border-b-2 -mb-0.5 ${
              activeTab === index
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{children[activeTab]}</div>
    </div>
  );
};

// Progress Bar
interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showLabel = true
}) => {
  const percentage = (value / max) * 100;

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-gray-700">{label}</label>
          <span className="text-sm font-bold text-gray-600">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Divider
export const Divider: React.FC = () => <div className="h-px bg-gray-100 my-6" />;

// Grid
interface GridProps {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  cols = 3,
  gap = 'md',
  children
}) => {
  const colStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapStyles = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={`grid ${colStyles[cols]} ${gapStyles[gap]}`}>
      {children}
    </div>
  );
};
