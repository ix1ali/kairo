const COLUMNS = ["Koala", "Agency", "Freelancer", "Generic AI tool", "Doing it yourself"];

const ROWS: { label: string; values: (string | boolean)[] }[] = [
  { label: "Typical monthly cost", values: ["$49 – $279", "$2,000+", "$800+", "$20 – $60", "Your time"] },
  { label: "Written strategy first", values: [true, true, false, false, false] },
  { label: "Competitor teardown", values: [true, true, false, false, false] },
  { label: "Full 30-day calendar", values: [true, true, false, false, false] },
  { label: "Finished visuals, not prompts", values: [true, true, true, false, false] },
  { label: "Captions and hashtags per post", values: [true, true, true, true, false] },
  { label: "Video scripts with shot lists", values: ["Studio plan", true, "Sometimes", false, false] },
  { label: "Hero and slow-mover logic", values: [true, "Sometimes", false, false, false] },
  { label: "Remembers your brand", values: [true, true, true, "Per chat", true] },
  { label: "Turnaround for a full month", values: ["Minutes", "2 – 4 weeks", "1 – 2 weeks", "Hours of prompting", "Never quite finished"] },
  { label: "Posting tracker and feedback loop", values: [true, false, false, false, false] },
];

function Cell({ value, primary }: { value: string | boolean; primary: boolean }) {
  if (value === true)
    return (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="mx-auto">
        <circle cx="8.5" cy="8.5" r="8.5" fill={primary ? "rgba(124,92,255,0.22)" : "rgba(255,255,255,0.06)"} />
        <path
          d="M5 8.6l2.4 2.4L12 6.4"
          stroke={primary ? "#7C5CFF" : "#7E7E93"}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (value === false)
    return (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="mx-auto">
        <circle cx="8.5" cy="8.5" r="8.5" fill="rgba(255,255,255,0.035)" />
        <path d="M5.8 5.8l5.4 5.4M11.2 5.8l-5.4 5.4" stroke="#3E3E4E" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  return (
    <span className={`text-[12.5px] ${primary ? "font-semibold text-[#C9BEFF]" : "text-[#7E7E93]"}`}>
      {value}
    </span>
  );
}

export default function Comparison() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#1E1E28] bg-white/[0.02]">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#1E1E28]">
            <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-widest text-[#7E7E93]">
              What you get
            </th>
            {COLUMNS.map((c, i) => (
              <th
                key={c}
                className={`px-4 py-4 text-center text-[13px] font-semibold ${
                  i === 0
                    ? "border-x border-[#7C5CFF]/30 bg-[#7C5CFF]/[0.07] text-white"
                    : "text-[#7C7C90]"
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, ri) => (
            <tr key={row.label} className={ri % 2 ? "bg-white/[0.02]" : ""}>
              <td className="border-t border-[#16161F] px-5 py-3.5 text-[13px] font-medium text-[#B9B9CC]">
                {row.label}
              </td>
              {row.values.map((v, i) => (
                <td
                  key={i}
                  className={`border-t border-[#16161F] px-4 py-3.5 text-center ${
                    i === 0 ? "border-x border-[#7C5CFF]/30 bg-[#7C5CFF]/[0.07]" : ""
                  }`}
                >
                  <Cell value={v} primary={i === 0} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
