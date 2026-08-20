"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useAuthModal } from "@/components/modals/auth-modal/use-auth-modal";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const links = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

// Animation variants
const menuVariants: any = {
  closed: {
    opacity: 0,
    y: -12,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: any = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0 },
};

export function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openDialog } = useAuthModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5 ${
          scrolled ? "glass-panel shadow-soft" : "border border-transparent"
        }`}
      >
        <Link
          href="#top"
          className="rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {session?.user && (
            <Link href="/app" passHref>
              <Button className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-ink-foreground shadow-soft transition-transform hover:-translate-y-px">
                Your Dashboard <ArrowRight />
              </Button>
            </Link>
          )}
          {!session?.user && (
            <>
              <Button
                onClick={() => openDialog("signin")}
                variant={"ghost"}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Button>
              <Button
                onClick={() => openDialog("signup")}
                className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-ink-foreground shadow-soft transition-transform hover:-translate-y-px"
              >
                Start free trial
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-border p-2 text-foreground md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={open ? "close" : "open"}
              initial={{ opacity: 0, rotate: open ? -90 : 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: open ? 90 : -90 }}
              transition={{ duration: 0.15 }}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="mx-auto mt-2 max-w-6xl rounded-2xl glass-panel p-3 shadow-soft md:hidden overflow-hidden"
          >
            {links.map((l) => (
              <motion.div key={l.href} variants={itemVariants}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div variants={itemVariants} className="pt-2">
              <Button
                onClick={() => {
                  openDialog("signin");
                  setOpen(false);
                }}
                className="w-full"
              >
                Start free trial
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass-panel px-4 py-3 md:hidden">
      <a
        href="#start"
        className="flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-ink-foreground"
      >
        Start free — no card required
      </a>
    </div>
  );
}
