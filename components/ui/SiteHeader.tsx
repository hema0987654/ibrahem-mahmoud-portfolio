import { profile } from "@/content/profile";
import { navItems } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="page flex h-14 items-center justify-between gap-6">
        <a href="#top" className="label flex items-center gap-3 text-text" aria-label={`${profile.name}, back to top`}>
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center border border-text text-[0.6875rem] tracking-normal"
          >
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>
        <nav aria-label="Sections">
          <ul className="flex items-center gap-5 sm:gap-7">
            {navItems.map((item) => (
              <li
                key={item.href}
                // On small screens only the destination that matters stays in the bar.
                className={item.href === "#contact" ? "" : "hidden md:block"}
              >
                <a href={item.href} className="label link py-2 text-text">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
