import type { Endpoint } from "@/content/systems";

type Props = { endpoints: readonly Endpoint[]; tone?: "paper" | "ink"; label?: string };

/** Real routes from the repository, set in mono like a route table. */
export function EndpointList({ endpoints, tone = "paper", label = "Endpoints" }: Props) {
  const border = tone === "ink" ? "border-paper/20" : "border-line";
  const method = tone === "ink" ? "text-signal-on-ink" : "text-signal";
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {endpoints.map((endpoint) => (
        <li
          key={`${endpoint.method}-${endpoint.path}`}
          className={`border ${border} px-2.5 py-1.5 font-mono text-xs leading-none`}
        >
          <span className={method}>{endpoint.method}</span> {endpoint.path}
        </li>
      ))}
    </ul>
  );
}
