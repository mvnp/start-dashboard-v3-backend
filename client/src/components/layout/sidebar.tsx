import { Link, useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import UserSwitcher from "@/components/user-switcher";
import BusinessChangeButton from "@/components/business-change-button";
import { TranslatableText } from "@/components/translatable-text";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-slate-200">
            <div className="w-8 h-8 bg-barber-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold text-slate-900">BarberPro</span>
          </div>

          {/* User Switcher */}
          <div className="px-4 py-4">
            <UserSwitcher />
          </div>

          {/* Business Selector */}
          <div className="px-4 pb-4">
            <BusinessChangeButton />
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-2 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              if (item.target === "_blank") {
                return (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                      "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <TranslatableText>{item.name}</TranslatableText>
                  </a>
                );
              }
              
              return (
                <Link key={item.name} href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                      isActive 
                        ? "barber-primary bg-orange-50 border border-orange-200" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <TranslatableText>{item.name}</TranslatableText>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200">
            <Link href="/logout">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                <TranslatableText>Logout</TranslatableText>
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
