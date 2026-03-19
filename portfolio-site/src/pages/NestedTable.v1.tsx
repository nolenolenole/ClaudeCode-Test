import { useState, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = 'Online' | 'Offline' | 'Pending' | 'Draft';
type TabFilter = 'All' | 'Approved' | 'Pending' | 'Draft' | 'Not passed';

interface Variant {
  id: string;
  name: string;
  sku: string;
  status: StatusType;
  price: number;
  monthlyViews: number;
  qualityScore: number;
  assignedOwner: string;
  lastUpdated: string;
}

interface Product {
  id: string;
  name: string;
  productId: string;
  tags: string[];
  status: StatusType;
  price: number;
  priceRange?: [number, number];
  monthlyViews: number;
  qualityScore: number;
  assignedOwner: string;
  lastUpdated: string;
  variants?: Variant[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Amazon Basics 5 Cube Organizer Storage Shelves',
    productId: '1600987854312',
    tags: [],
    status: 'Online',
    price: 45.99,
    monthlyViews: 12840,
    qualityScore: 92,
    assignedOwner: 'Alice Chen',
    lastUpdated: '2026-03-15',
  },
  {
    id: 'p2',
    name: 'High Quality Silicone Kitchen Rolling Mat',
    productId: '1600987854313',
    tags: ['RTS'],
    status: 'Offline',
    price: 18.5,
    monthlyViews: 3210,
    qualityScore: 78,
    assignedOwner: 'Bob Liu',
    lastUpdated: '2026-03-10',
  },
  {
    id: 'p3',
    name: 'BOFENG Twin Size Bed Frame with Headboard',
    productId: '1600987854314',
    tags: ['RTS'],
    status: 'Pending',
    price: 0,
    priceRange: [189, 239],
    monthlyViews: 28760,
    qualityScore: 85,
    assignedOwner: 'Carol Wang',
    lastUpdated: '2026-03-16',
    variants: [
      {
        id: 'p3-v1',
        name: 'Twin / White Oak',
        sku: 'BF-TW-WO',
        status: 'Online',
        price: 189,
        monthlyViews: 15200,
        qualityScore: 88,
        assignedOwner: 'Carol Wang',
        lastUpdated: '2026-03-16',
      },
      {
        id: 'p3-v2',
        name: 'Twin / Dark Walnut',
        sku: 'BF-TW-DW',
        status: 'Pending',
        price: 199,
        monthlyViews: 9800,
        qualityScore: 83,
        assignedOwner: 'Carol Wang',
        lastUpdated: '2026-03-14',
      },
      {
        id: 'p3-v3',
        name: 'Twin XL / White Oak',
        sku: 'BF-TXL-WO',
        status: 'Offline',
        price: 239,
        monthlyViews: 3760,
        qualityScore: 81,
        assignedOwner: 'Carol Wang',
        lastUpdated: '2026-03-12',
      },
    ],
  },
  {
    id: 'p4',
    name: 'Bean Bag Sofa Cover (No Filler), Large Size',
    productId: '1600987854315',
    tags: ['RTS'],
    status: 'Online',
    price: 0,
    priceRange: [27, 35],
    monthlyViews: 9540,
    qualityScore: 70,
    assignedOwner: 'David Zhang',
    lastUpdated: '2026-03-13',
    variants: [
      {
        id: 'p4-v1',
        name: 'Blue / Large',
        sku: 'BBG-BL-L',
        status: 'Online',
        price: 29.99,
        monthlyViews: 5400,
        qualityScore: 72,
        assignedOwner: 'David Zhang',
        lastUpdated: '2026-03-13',
      },
      {
        id: 'p4-v2',
        name: 'Red / Medium',
        sku: 'BBG-RD-M',
        status: 'Offline',
        price: 27.5,
        monthlyViews: 2800,
        qualityScore: 68,
        assignedOwner: 'David Zhang',
        lastUpdated: '2026-03-11',
      },
      {
        id: 'p4-v3',
        name: 'Grey / XL',
        sku: 'BBG-GR-XL',
        status: 'Draft',
        price: 34.99,
        monthlyViews: 1340,
        qualityScore: 65,
        assignedOwner: 'Unassigned',
        lastUpdated: '2026-03-08',
      },
    ],
  },
  {
    id: 'p5',
    name: 'FERFALDER Faux Leather Wingback Accent Chair',
    productId: '1600987854316',
    tags: [],
    status: 'Draft',
    price: 299.99,
    monthlyViews: 4120,
    qualityScore: 60,
    assignedOwner: 'Unassigned',
    lastUpdated: '2026-03-09',
  },
  {
    id: 'p6',
    name: 'KCISOT Wall Clock, Modern Small Silent',
    productId: '1600987854317',
    tags: [],
    status: 'Online',
    price: 0,
    priceRange: [22, 38],
    monthlyViews: 18900,
    qualityScore: 88,
    assignedOwner: 'Alice Chen',
    lastUpdated: '2026-03-17',
    variants: [
      {
        id: 'p6-v1',
        name: '10 inch / Black',
        sku: 'WC-10-BK',
        status: 'Online',
        price: 22.99,
        monthlyViews: 11200,
        qualityScore: 90,
        assignedOwner: 'Alice Chen',
        lastUpdated: '2026-03-17',
      },
      {
        id: 'p6-v2',
        name: '12 inch / White',
        sku: 'WC-12-WH',
        status: 'Online',
        price: 38,
        monthlyViews: 7700,
        qualityScore: 87,
        assignedOwner: 'Alice Chen',
        lastUpdated: '2026-03-15',
      },
    ],
  },
  {
    id: 'p7',
    name: 'Homfa Bamboo Bathroom Storage Cabinet',
    productId: '1600987854318',
    tags: [],
    status: 'Pending',
    price: 89.99,
    monthlyViews: 6320,
    qualityScore: 74,
    assignedOwner: 'Bob Liu',
    lastUpdated: '2026-03-14',
  },
  {
    id: 'p8',
    name: 'Utopia Bedding Throw Pillows (Set of 4)',
    productId: '1600987854319',
    tags: ['RTS'],
    status: 'Offline',
    price: 24.99,
    monthlyViews: 2180,
    qualityScore: 55,
    assignedOwner: 'Unassigned',
    lastUpdated: '2026-03-07',
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusType, { label: string; bg: string; text: string; dot: string }> = {
  Online:  { label: 'Online',  bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Offline: { label: 'Offline', bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400'    },
  Pending: { label: 'Pending', bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400'   },
  Draft:   { label: 'Draft',   bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400'    },
};

function StatusBadge({ status }: { status: StatusType }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Thumbnail({ letter, color }: { letter: string; color: string }) {
  return (
    <div
      className={`w-9 h-9 rounded flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm ${color}`}
      style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}
    >
      {letter}
    </div>
  );
}

const THUMBNAIL_COLORS = [
  'bg-blue-400', 'bg-violet-400', 'bg-rose-400', 'bg-amber-400',
  'bg-teal-400', 'bg-cyan-400', 'bg-fuchsia-400', 'bg-orange-400',
];

// ─── Chevron Icon ─────────────────────────────────────────────────────────────

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.854 8.854a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 8H2.5a.5.5 0 0 0 0 1h9.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3Z" transform="rotate(-90 8 8)" />
      <path d="M13.854 8.854a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 8H2.5a.5.5 0 0 0 0 1h9.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3Z" transform="rotate(90 8 8)" />
    </svg>
  );
}

// ─── Indeterminate Checkbox ───────────────────────────────────────────────────

function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all
        ${checked || indeterminate
          ? 'bg-blue-600 border-blue-600'
          : 'bg-white border-gray-300 hover:border-blue-400'}
      `}
      aria-checked={indeterminate ? 'mixed' : checked}
    >
      {indeterminate && !checked && (
        <span className="w-2 h-0.5 bg-white rounded-full" />
      )}
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function fmtPrice(p: Product) {
  if (p.priceRange) return `$${p.priceRange[0]}–$${p.priceRange[1]}`;
  return `$${p.price.toFixed(2)}`;
}
function fmtViews(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
function formatDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NestedTable() {
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // ── Tab counts ──────────────────────────────────────────────────────────────
  const tabCounts: Record<TabFilter, number> = useMemo(() => ({
    All: PRODUCTS.length,
    Approved: PRODUCTS.filter(p => p.status === 'Online').length,
    Pending: PRODUCTS.filter(p => p.status === 'Pending').length,
    Draft: PRODUCTS.filter(p => p.status === 'Draft').length,
    'Not passed': PRODUCTS.filter(p => p.status === 'Offline').length,
  }), []);

  // ── Filter products ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeTab !== 'All') {
      const map: Record<TabFilter, StatusType | null> = {
        All: null, Approved: 'Online', Pending: 'Pending', Draft: 'Draft', 'Not passed': 'Offline',
      };
      const target = map[activeTab];
      if (target) list = list.filter(p => p.status === target);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.productId.includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeTab, search]);

  // ── Expand / collapse ───────────────────────────────────────────────────────
  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(filtered.filter(p => p.variants?.length).map(p => p.id)));
  const collapseAll = () => setExpanded(new Set());

  // ── Selection helpers ───────────────────────────────────────────────────────
  const allIds: string[] = useMemo(() => {
    const ids: string[] = [];
    filtered.forEach(p => {
      ids.push(p.id);
      p.variants?.forEach(v => ids.push(v.id));
    });
    return ids;
  }, [filtered]);

  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));
  const someSelected = !allSelected && allIds.some(id => selected.has(id));

  const toggleAll = (v: boolean) => {
    setSelected(v ? new Set(allIds) : new Set());
  };

  const productCheckState = (p: Product): { checked: boolean; indeterminate: boolean } => {
    const ids = [p.id, ...(p.variants?.map(v => v.id) ?? [])];
    const checkedCount = ids.filter(id => selected.has(id)).length;
    if (checkedCount === 0) return { checked: false, indeterminate: false };
    if (checkedCount === ids.length) return { checked: true, indeterminate: false };
    return { checked: false, indeterminate: true };
  };

  const toggleProduct = (p: Product, v: boolean) => {
    const ids = [p.id, ...(p.variants?.map(vr => vr.id) ?? [])];
    setSelected(prev => {
      const next = new Set(prev);
      ids.forEach(id => v ? next.add(id) : next.delete(id));
      return next;
    });
  };

  const toggleVariant = (vid: string, parentId: string, v: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      v ? next.add(vid) : next.delete(vid);
      return next;
    });
    if (v) setExpanded(prev => new Set([...prev, parentId]));
  };

  const selectedCount = selected.size;
  const selectedProductCount = filtered.filter(p => selected.has(p.id)).length;
  const selectedVariantCount = filtered.reduce((acc, p) => acc + (p.variants?.filter(v => selected.has(v.id)).length ?? 0), 0);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your product catalog and variants</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
          >
            Collapse all
          </button>
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
          >
            Expand all
          </button>
          <button className="px-4 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-medium">
            Add product
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* ── Tab filter bar ─────────────────────────────────────────────────── */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center px-4 pt-2 gap-0.5">
            {(['All', 'Approved', 'Pending', 'Draft', 'Not passed'] as TabFilter[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative px-4 py-2.5 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap
                  ${activeTab === tab
                    ? 'text-blue-600 bg-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                {tab}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-normal ${
                  activeTab === tab ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Toolbar: Search OR Bulk actions ───────────────────────────────── */}
        <div className="border-b border-gray-200 min-h-[52px] flex items-center">
          {selectedCount > 0 ? (
            /* Bulk action bar — slides in */
            <div className="flex items-center gap-3 px-4 py-2 w-full animate-slide-down">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {selectedCount} selected
                {(selectedProductCount > 0 || selectedVariantCount > 0) && (
                  <span className="font-normal text-gray-400 ml-1">
                    ({selectedProductCount > 0 && `${selectedProductCount} product${selectedProductCount > 1 ? 's' : ''}`}
                    {selectedProductCount > 0 && selectedVariantCount > 0 && ', '}
                    {selectedVariantCount > 0 && `${selectedVariantCount} variant${selectedVariantCount > 1 ? 's' : ''}`})
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {['Refresh', 'Display online', 'Take offline', 'Delete'].map(action => (
                  <button
                    key={action}
                    className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
                      action === 'Delete'
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {action}
                  </button>
                ))}
                <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1">
                  Assign owner
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 8L2 4h8L6 8z" />
                  </svg>
                </button>
                <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                  Batch editing
                </button>
                <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                  Export excel
                </button>
              </div>
              <button
                onClick={() => setSelected(new Set())}
                className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          ) : (
            /* Search + filter toolbar */
            <div className="flex items-center gap-2 px-4 py-2 w-full">
              <div className="flex items-center gap-2 flex-1 max-w-sm bg-white border border-gray-200 rounded-md px-3 py-1.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search product name, ID, type, group..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </button>
                )}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors">
                <FilterIcon />
                More filters
              </button>
            </div>
          )}
        </div>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {/* Checkbox + expand placeholder */}
                <th className="w-10 pl-4 pr-2 py-3">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th className="w-5 px-0 py-3" />
                {/* Columns */}
                {[
                  { label: 'Product information', w: 'min-w-[280px]' },
                  { label: 'Status',              w: 'w-28' },
                  { label: 'Price',               w: 'w-28' },
                  { label: 'Monthly views',       w: 'w-28' },
                  { label: 'Quality score',       w: 'w-28' },
                  { label: 'Assigned owner',      w: 'w-36' },
                  { label: 'Last updated',        w: 'w-32' },
                  { label: 'Action',              w: 'w-16' },
                ].map(col => (
                  <th
                    key={col.label}
                    className={`${col.w} px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap`}
                  >
                    <span className="flex items-center gap-1 select-none cursor-pointer hover:text-gray-700 transition-colors group">
                      {col.label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <SortIcon />
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-gray-400 text-sm">
                    No products found
                  </td>
                </tr>
              )}

              {filtered.map((product, pi) => {
                const hasVariants = (product.variants?.length ?? 0) > 0;
                const isExpanded = expanded.has(product.id);
                const { checked, indeterminate } = productCheckState(product);
                const thumbColor = THUMBNAIL_COLORS[pi % THUMBNAIL_COLORS.length];
                const thumbLetter = product.name[0].toUpperCase();

                return (
                  <>
                    {/* ── Parent row ───────────────────────────────────────── */}
                    <tr
                      key={product.id}
                      className={`group transition-colors ${
                        checked || indeterminate ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="pl-4 pr-2 py-3 align-middle">
                        <Checkbox
                          checked={checked}
                          indeterminate={indeterminate}
                          onChange={v => toggleProduct(product, v)}
                        />
                      </td>

                      {/* Expand chevron */}
                      <td className="w-5 px-0 py-3 align-middle">
                        {hasVariants ? (
                          <button
                            onClick={() => toggleExpand(product.id)}
                            title={isExpanded ? 'Collapse variants' : 'Expand variants'}
                            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          </button>
                        ) : (
                          <span className="w-5 inline-block" />
                        )}
                      </td>

                      {/* Product information */}
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <Thumbnail letter={thumbLetter} color={thumbColor} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-gray-900 text-sm truncate max-w-[200px]" title={product.name}>
                                {product.name}
                              </span>
                              {product.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded">
                                  {tag}
                                </span>
                              ))}
                              {hasVariants && (
                                <button
                                  onClick={() => toggleExpand(product.id)}
                                  className="text-[10px] font-medium text-blue-500 hover:text-blue-700 hover:underline transition-colors"
                                >
                                  {product.variants!.length} variants
                                </button>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">ID: {product.productId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 align-middle">
                        <StatusBadge status={product.status} />
                      </td>

                      {/* Price */}
                      <td className="px-3 py-3 align-middle text-gray-700 font-medium">
                        {fmtPrice(product)}
                      </td>

                      {/* Monthly views */}
                      <td className="px-3 py-3 align-middle text-gray-600">
                        {fmtViews(product.monthlyViews)}
                      </td>

                      {/* Quality score */}
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                product.qualityScore >= 80 ? 'bg-emerald-400' :
                                product.qualityScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${product.qualityScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{product.qualityScore}</span>
                        </div>
                      </td>

                      {/* Assigned owner */}
                      <td className="px-3 py-3 align-middle text-gray-600 text-sm">
                        {product.assignedOwner === 'Unassigned' ? (
                          <span className="text-gray-400 italic text-xs">Unassigned</span>
                        ) : product.assignedOwner}
                      </td>

                      {/* Last updated */}
                      <td className="px-3 py-3 align-middle text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(product.lastUpdated)}
                      </td>

                      {/* Action */}
                      <td className="px-3 py-3 align-middle">
                        <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600 hover:bg-gray-100 transition-all">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    {/* ── Variant rows (children) ──────────────────────────── */}
                    {hasVariants && isExpanded && product.variants!.map((variant, vi) => {
                      const isLast = vi === product.variants!.length - 1;
                      const variantChecked = selected.has(variant.id);

                      return (
                        <tr
                          key={variant.id}
                          className={`group transition-colors ${
                            variantChecked ? 'bg-blue-50/30' : 'bg-gray-50/60 hover:bg-gray-50'
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="pl-4 pr-2 py-2.5 align-middle">
                            <Checkbox
                              checked={variantChecked}
                              onChange={v => toggleVariant(variant.id, product.id, v)}
                            />
                          </td>

                          {/* Tree connector */}
                          <td className="w-5 px-0 py-2.5 align-middle relative">
                            <div className="absolute left-2 top-0 bottom-0 flex flex-col items-center pointer-events-none">
                              <div className="w-px bg-gray-200 flex-1" />
                              {isLast && <div className="h-1/2 w-px bg-transparent" />}
                            </div>
                            <div className="relative flex items-center h-full">
                              <div className="absolute left-2 top-1/2 w-3 h-px bg-gray-200" />
                            </div>
                          </td>

                          {/* Variant info (indented) */}
                          <td className="py-2.5 align-middle" style={{ paddingLeft: '28px' }}>
                            <div className="flex items-center gap-3">
                              {/* Variant color chip */}
                              <div className="w-7 h-7 rounded border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25Zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0Z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm text-gray-700 font-medium">{variant.name}</div>
                                <div className="text-xs text-gray-400 mt-0.5">SKU: {variant.sku}</div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-3 py-2.5 align-middle">
                            <StatusBadge status={variant.status} />
                          </td>

                          {/* Price */}
                          <td className="px-3 py-2.5 align-middle text-gray-700 font-medium">
                            ${variant.price.toFixed(2)}
                          </td>

                          {/* Monthly views */}
                          <td className="px-3 py-2.5 align-middle text-gray-500 text-xs">
                            {fmtViews(variant.monthlyViews)}
                          </td>

                          {/* Quality score */}
                          <td className="px-3 py-2.5 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    variant.qualityScore >= 80 ? 'bg-emerald-400' :
                                    variant.qualityScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
                                  }`}
                                  style={{ width: `${variant.qualityScore}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">{variant.qualityScore}</span>
                            </div>
                          </td>

                          {/* Assigned owner */}
                          <td className="px-3 py-2.5 align-middle text-gray-500 text-xs">
                            {variant.assignedOwner === 'Unassigned' ? (
                              <span className="text-gray-400 italic">Unassigned</span>
                            ) : variant.assignedOwner}
                          </td>

                          {/* Last updated */}
                          <td className="px-3 py-2.5 align-middle text-xs text-gray-400 whitespace-nowrap">
                            {formatDate(variant.lastUpdated)}
                          </td>

                          {/* Action */}
                          <td className="px-3 py-2.5 align-middle">
                            <button className="w-7 h-7 flex items-center justify-center rounded text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-500 hover:bg-gray-100 transition-all">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* ── Expand hint (collapsed, has variants) ────────────── */}
                    {hasVariants && !isExpanded && (
                      <tr key={`${product.id}-hint`} className="bg-gray-50/40">
                        <td colSpan={2} />
                        <td colSpan={9} className="px-3 py-1.5">
                          <button
                            onClick={() => toggleExpand(product.id)}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors group/hint"
                          >
                            <div className="flex gap-0.5">
                              {product.variants!.slice(0, 3).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/hint:bg-blue-300 transition-colors" />
                              ))}
                            </div>
                            <ChevronRight className="w-3 h-3 group-hover/hint:text-blue-500" />
                            <span>Show {product.variants!.length} variants</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer / Pagination ────────────────────────────────────────────── */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {PRODUCTS.length} products
            {selectedCount > 0 && (
              <span className="ml-2 text-blue-600 font-medium">{selectedCount} selected</span>
            )}
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 15].map((p, i) => (
              <button
                key={i}
                className={`w-7 h-7 text-xs rounded flex items-center justify-center transition-colors ${
                  p === 1
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legend / Interaction guide ─────────────────────────────────────── */}
      <div className="mt-4 flex items-center gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3" />
          Click to expand variants
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded border border-gray-300 bg-white inline-flex items-center justify-center">
            <span className="w-2 h-0.5 bg-gray-400 rounded" />
          </span>
          Partial selection
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Online
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-400" /> Offline / Draft
        </span>
      </div>
    </div>
  );
}
