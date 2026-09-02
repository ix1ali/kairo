"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/Ui";
import LocalePicker from "./LocalePicker";
import { DEFAULT_PREFS, POSTING_RHYTHMS, type UserPreferences } from "@/lib/preferences";

/**
 * Real, persisted preferences — every control here changes something the app
 * actually reads when it builds or exports a month. Nothing is a placeholder.
 */
export default function PreferencesForm({ initial }: { initial?: UserPreferences }) {
  const [prefs, setPrefs] = useState<UserPreferences>({ ...DEFAULT_PREFS, ...initial });
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  function set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
    setState("idle");
  }

  async function save() {
    setState("saving");
    setError("");
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      const raw = await res.text();
      let data: { error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setError(`The server returned an unexpected reply (${res.status}).`);
        setState("error");
        return;
      }
      if (!res.ok) {
        setError(data.error || `Could not save (${res.status}).`);
        setState("error");
        return;
      }
      setState("saved");
    } catch {
      setError("Could not reach the server. Check your connection.");
      setState("error");
    }
  }

  return (
    <section className="panel p-6">
      <h2 className="display mb-2 text-lg">Preferences</h2>
      <p className="mb-5 text-[13px] leading-relaxed text-[#63637A]">
        Defaults for every new project and every export. Changing these does not touch months you
        have already generated.
      </p>

      <div className="space-y-5">
        <div>
          <label className="label">Week starts on</label>
          <div className="grid grid-cols-2 gap-2 sm:max-w-xs">
            {[
              { v: 0 as const, label: "Sunday" },
              { v: 1 as const, label: "Monday" },
            ].map((d) => (
              <button
                key={d.v}
                onClick={() => set("weekStartsOn", d.v)}
                className={`rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  prefs.weekStartsOn === d.v
                    ? "border-[#7C5CFF] bg-[#7C5CFF]/12 text-[#5B3FE0]"
                    : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] text-[#55556B] hover:border-[#C9BEEB]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-[#6E6E85]">
            Sets how the calendar groups a week. Sunday is the working week across the Gulf.
          </p>
        </div>

        <div>
          <label className="label">Posting rhythm</label>
          <div className="grid gap-2 sm:grid-cols-3">
            {POSTING_RHYTHMS.map((r) => (
              <button
                key={r.key}
                onClick={() => set("rhythm", r.key)}
                className={`rounded-xl border p-3 text-start transition-colors ${
                  prefs.rhythm === r.key
                    ? "border-[#7C5CFF] bg-[#7C5CFF]/12"
                    : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9BEEB]"
                }`}
              >
                <p className="text-[13px] font-semibold text-[#0B0B12]">{r.label}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-[#63637A]">{r.note}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Default caption language</label>
            <LocalePicker value={prefs.locale} onChange={(v) => set("locale", v)} />
          </div>
          <div>
            <label className="label">Download format</label>
            <select
              className="input"
              value={prefs.exportFormat}
              onChange={(e) => set("exportFormat", e.target.value as UserPreferences["exportFormat"])}
            >
              <option value="png">PNG — ready to post</option>
              <option value="svg">SVG — editable vector</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {(
            [
              ["remindDue", "Remind me what is due", "A daily summary of the posts scheduled for today."],
              ["weeklyDigest", "Weekly progress digest", "What went out, what slipped, and next week at a glance."],
              ["autoHashtags", "Include hashtags in downloads", "Append the hashtag block to the copied caption."],
            ] as const
          ).map(([key, label, note]) => (
            <button
              key={key}
              onClick={() => set(key, !prefs[key])}
              className="flex w-full items-start gap-3 rounded-xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-3.5 text-start transition-colors hover:border-[#C9BEEB]"
            >
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
                  prefs[key]
                    ? "border-[#7C5CFF] bg-[#7C5CFF] text-white"
                    : "border-[#C9C9D8] bg-transparent text-transparent"
                }`}
              >
                <Icon name="check" size={12} strokeWidth={3} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-medium text-[#0B0B12]">{label}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-[#63637A]">{note}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={save} className="btn btn-primary btn-sm" disabled={state === "saving"}>
          {state === "saving" ? "Saving…" : "Save preferences"}
        </button>
        {state === "saved" && (
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#4D7C0F]">
            <Icon name="checkCircle" size={13} />
            Saved
          </span>
        )}
        {state === "error" && (
          <span className="text-[12.5px] text-[#C2255C]">{error}</span>
        )}
      </div>
    </section>
  );
}
