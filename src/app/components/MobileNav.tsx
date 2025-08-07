"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DarkButton from "./DarkButton";
import Weather from "./Weather";

interface NavItem {
  name: string;
  link: string;
}

interface MobileNavProps {
  navList: NavItem[];
}

export default function MobileNav({ navList }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header: always above sidebar */}
      <div className="mobile-header">
        <button
          className={`hamburger-menu ${isOpen ? "active" : ""}`}
          onClick={isOpen ? closeSidebar : toggleSidebar}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? (
            // Cross icon
            <span
              style={{
                fontSize: "2rem",
                color: "inherit",
                lineHeight: "1",
              }}
            >
              &#10005;
            </span>
          ) : (
            <>
              <span></span>
              <span></span>
              <span></span>
            </>
          )}
        </button>
        <div className="mobile-logo">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={93}
              height={40}
            />
          </Link>
        </div>
        <div className="mobile-actions">
          <DarkButton />
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar: no header, just nav and footer */}
      <div className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          <ul>
            {navList.map((navItem) => (
              <li key={navItem.name}>
                <Link href={navItem.link} onClick={closeSidebar}>
                  {navItem.name}
                </Link>
              </li>
            ))}
            {/* Dark Mode Toggle as Navigation Item */}
            <li key="dark-mode" className="dark-mode-nav-item">
              <div className="dark-mode-toggle-nav">
                <span className="dark-mode-label">Dark Mode</span>
                <DarkButton />
              </div>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div className="weather-widget">
            <Weather />
          </div>
        </div>
      </div>
    </>
  );
}
