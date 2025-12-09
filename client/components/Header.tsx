import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
// Import the logo
import logo from '../assets/institute-logo.png';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const location = useLocation();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
      label: 'Academics',
      submenu: [
        { label: 'All Courses', href: '/academics' },
        { label: 'Examinations & Results', href: '/examinations' },
      ]
    },
    { label: 'Admissions', href: '/admissions' },
    {
      label: 'Campus Life',
      submenu: [
        { label: 'Student Life & Activities', href: '/student-life' },
        { label: 'Placements', href: '/placements' },
        { label: 'News & Updates', href: '/news' },
      ]
    },
    {
      label: 'Resources',
      submenu: [
        { label: 'Student Corner', href: '/student-corner' },
        { label: 'Contact Us', href: '/contact' },
      ]
    },
  ];

  const isActiveMenu = (item: any) => {
    if (item.href) {
      return location.pathname === item.href;
    }
    if (item.submenu) {
      return item.submenu.some((sub: any) => location.pathname === sub.href);
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 relative">
          {/* Logo - Left */}
          <div className="flex-shrink-0 z-10">
            <Link to="/">
              <img src={logo} alt="Institute Logo" className="h-16 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation - Absolute Center */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
            <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-[#FFEAEB]">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`text-sm font-bold whitespace-nowrap ${isActiveMenu(item) ? 'text-[#FF4040]' : 'text-[#2e2e2e]'
                        }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        className={`text-sm font-bold whitespace-nowrap flex items-center gap-1 ${isActiveMenu(item) ? 'text-[#FF4040]' : 'text-[#2e2e2e]'
                          }`}
                      >
                        {item.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                        <div className="py-2">
                          {item.submenu?.map((subItem: any) => (
                            <Link
                              key={subItem.label}
                              to={subItem.href}
                              className={`block px-6 py-3 text-sm font-semibold hover:bg-[#FFF5F5] transition-colors ${location.pathname === subItem.href ? 'text-[#FF4040] bg-[#FFF5F5]' : 'text-gray-700'
                                }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 z-10">
            {/* Contact Button - Desktop */}
            <Link
              to="/contact"
              className="hidden lg:block px-6 py-3 bg-[#BFD8FF] rounded-full text-[#0B0B3B] text-sm font-bold hover:bg-blue-200 transition-colors"
            >
              Contact Us
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Sidebar */}
      {mobileOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="fixed top-0 right-0 z-[101] h-screen w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-in-out animate-in slide-in-from-right"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <span className="text-xl font-bold text-gray-900">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Sidebar Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-6">
                <div className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      {item.href ? (
                        <Link
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`text-lg font-medium flex items-center justify-between group ${location.pathname === item.href ? 'text-[#FF4040]' : 'text-gray-800'
                            }`}
                        >
                          {item.label}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">→</span>
                        </Link>
                      ) : (
                        <div>
                          <button
                            onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                            className={`w-full text-lg font-medium flex items-center justify-between ${isActiveMenu(item) ? 'text-[#FF4040]' : 'text-gray-800'
                              }`}
                          >
                            {item.label}
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobile === item.label ? 'rotate-180' : ''}`} />
                          </button>
                          {expandedMobile === item.label && (
                            <div className="mt-2 ml-4 space-y-2">
                              {item.submenu?.map((subItem: any) => (
                                <Link
                                  key={subItem.label}
                                  to={subItem.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`block text-base font-medium py-2 ${location.pathname === subItem.href ? 'text-[#FF4040]' : 'text-gray-600'
                                    }`}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </nav>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-gray-100">
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Follow Us On
                  </h4>
                  <div className="flex gap-4">
                    {['f', 'in', 'tw', 'ig'].map((social, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-[#BFD8FF] hover:text-[#0B0B3B] transition-colors"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>

                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-[#BFD8FF] rounded-xl text-[#0B0B3B] font-bold hover:bg-blue-200 transition-colors shadow-sm block text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
