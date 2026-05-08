import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

const onlineServiceItems = [
  { label: "View Marks", href: "/view-marks" },
  { label: "Registration", href: "/registration" },
  { label: "Description", href: "/description" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">SMS</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            <span className="text-gradient">SMS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>

          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Online Service
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-md border border-border bg-card shadow-lg"
                >
                  {onlineServiceItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="block px-4 py-3 text-sm text-foreground transition-colors hover:bg-surface"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            search={{ portal: "student" }}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Login
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-border px-6 pb-6 md:hidden"
        >
          <nav className="flex flex-col gap-4 pt-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>About</Link>
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Online Service</span>
              {onlineServiceItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block pl-4 text-sm text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              to="/login"
              search={{ portal: "student" }}
              className="w-full rounded-md bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
