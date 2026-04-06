export const MONTHS_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
export const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Actual data months (1-3), forecast months (4-12)
export const ACTUAL_MONTHS = 3;

export const CLIENT_COLORS: Record<string, string> = {
  'Adobe APAC': '#3B82F6',
  'Adobe KR': '#6366F1',
  'Databricks': '#EF4444',
  'Samsung': '#1428A0',
  'Merck': '#00857C',
  'Ralph Lauren': '#1B1B1B',
  'Monday': '#FF3D57',
  'Omnicon': '#F97316',
  'Loreal': '#8B5CF6',
  'Nike': '#FF6B00',
  'Dongsuh': '#78716C',
  'Salesforce': '#00A1E0',
  'VIVI': '#EC4899',
};

export const PACKAGE_COLORS: Record<string, string> = {
  'Consulting': '#3B82F6',
  'Retainer': '#10B981',
  'Tech Audit': '#F59E0B',
  'VIVI': '#EC4899',
};

export const MONTH_KEYS = [
  'm1', 'm2', 'm3', 'm4', 'm5', 'm6',
  'm7', 'm8', 'm9', 'm10', 'm11', 'm12',
] as const;

export const FALLBACK_COLOR = '#94A3B8';

export const NAV_ITEMS = [
  { label: '홈', href: '/', icon: 'LayoutDashboard' },
  { label: '매출', href: '/revenue', icon: 'TrendingUp' },
  { label: '비용', href: '/cost', icon: 'Receipt' },
  { label: '리소스', href: '/resources', icon: 'Users' },
];
