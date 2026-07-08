interface CodeCardProps {
  label: string;
  code: string;
  badgeClassName: string;
}

export default function CodeCard({ label, code, badgeClassName }: CodeCardProps) {
  return (
    <div className="bg-ink rounded-lg p-3 sm:p-4 min-w-0">
      <span className={"inline-block text-xs font-semibold px-2 py-1 rounded mb-2 " + badgeClassName}>
        {label}
      </span>
      <pre className="text-parchment text-xs sm:text-sm whitespace-pre-wrap break-words font-mono overflow-x-auto">{code}</pre>
    </div>
  );
}
