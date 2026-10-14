import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Grid, Package, ShoppingBag, Share2 } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, cartCount } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Explore', icon: Grid },
    { id: 'import-resell', label: 'Resell', icon: Share2, highlight: true },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex flex-col items-center justify-center relative py-1 px-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 font-bold' 
                  : item.highlight 
                    ? 'text-emerald-700 font-semibold' 
                    : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'} ${item.highlight && !isActive ? 'text-emerald-600' : ''}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${item.highlight && !isActive ? 'text-emerald-700 font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

