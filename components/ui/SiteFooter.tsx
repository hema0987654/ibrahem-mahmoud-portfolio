import { profile } from "@/content/profile";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex flex-col gap-6 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
      <ul className="flex gap-7">
        <li>
          <a href={profile.links.github} className="label link py-2" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </li>
        <li>
          <a href={profile.links.linkedin} className="label link py-2" target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </li>
      </ul>
      <p className="label text-muted">
        © {year} {profile.name} · {profile.location}
      </p>
    </footer>
  );
}
