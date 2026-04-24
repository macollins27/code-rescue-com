import { useEffect, useState } from "preact/hooks";
import {
  BOOKING_COPY,
  DELIVERABLES_OPTIONS,
  EMPTY_FORM,
  TEAM_SIZES,
  TIMELINES,
  type AvailabilityResponse,
  type DateOption,
  type DaySlots,
  type DeliverableKey,
  type FormState,
  type SlotInfo,
} from "@content/booking";
import { fetchAvailability, submitBooking, SlotTakenError, ValidationError } from "./api";
import { generateMockAvailability } from "./mockData";

interface DateStripProps {
  dates: ReadonlyArray<DateOption>;
  value: string | null;
  onChange: (key: string) => void;
}

function DateStrip({ dates, value, onChange }: DateStripProps) {
  return (
    <div class="date-strip" role="group" aria-label="Pick a day">
      {dates.map((d) => (
        <button
          key={d.key}
          type="button"
          onClick={() => onChange(d.key)}
          class={`date-chip${value === d.key ? " is-selected" : ""}`}
          aria-pressed={value === d.key}
        >
          <div class="date-chip-pill">{d.pill || " "}</div>
          <div class="date-chip-dow">{d.dow}</div>
          <div class="date-chip-day">{d.day}</div>
          <div class="date-chip-mon">{d.mon}</div>
        </button>
      ))}
    </div>
  );
}

interface TimeGridProps {
  slots: DaySlots;
  value: string | null;
  onChange: (t: string) => void;
}

function TimeGrid({ slots, value, onChange }: TimeGridProps) {
  const render = (label: string, list: ReadonlyArray<SlotInfo>) => (
    <>
      <div class="time-group-label">{label}</div>
      <div class="time-grid" role="group" aria-label={`${label} slots`}>
        {list.map((s) => (
          <button
            key={s.t}
            type="button"
            disabled={s.taken}
            onClick={() => onChange(s.t)}
            class={`time-slot${value === s.t ? " is-selected" : ""}`}
            aria-pressed={value === s.t}
          >
            {s.t}
          </button>
        ))}
      </div>
    </>
  );
  return (
    <>
      {render("Morning", slots.morning)}
      {render("Afternoon", slots.afternoon)}
    </>
  );
}

interface DelivTilesProps {
  value: DeliverableKey | "";
  onChange: (k: DeliverableKey) => void;
}

function DelivTiles({ value, onChange }: DelivTilesProps) {
  return (
    <div class="radio-group" role="radiogroup" aria-label="Deliverable you're circling">
      {DELIVERABLES_OPTIONS.map((d) => (
        <button
          key={d.k}
          type="button"
          role="radio"
          aria-checked={value === d.k}
          onClick={() => onChange(d.k)}
          class={`radio-tile${value === d.k ? " is-selected" : ""}`}
        >
          <div class="radio-tile-label">{d.label}</div>
          <div class="radio-tile-sub">{d.sub}</div>
        </button>
      ))}
    </div>
  );
}

function dateLabel(dates: ReadonlyArray<DateOption>, key: string | null): string {
  if (!key) return "";
  const d = dates.find((x) => x.key === key);
  return d ? `${d.dow} ${d.day} ${d.mon}` : "";
}

interface ConfirmationProps {
  when: string;
  time: string;
}

function Confirmation({ when, time }: ConfirmationProps) {
  return (
    <div>
      <div class="confirm-check" aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 class="confirm-headline">{BOOKING_COPY.confirmationHeadline}</h2>
      <p class="confirm-lede">{BOOKING_COPY.confirmationLede}</p>
      <dl class="confirm-summary">
        <dt>{BOOKING_COPY.confirmationWhenLabel}</dt>
        <dd>
          {when} · {time} · 30 min
        </dd>
        <dt>{BOOKING_COPY.confirmationWhoLabel}</dt>
        <dd>{BOOKING_COPY.confirmationWhoValue}</dd>
        <dt>{BOOKING_COPY.confirmationWhereLabel}</dt>
        <dd class="mono">{BOOKING_COPY.confirmationWhereValue}</dd>
        <dt>{BOOKING_COPY.confirmationRescheduleLabel}</dt>
        <dd>{BOOKING_COPY.confirmationRescheduleValue}</dd>
      </dl>
      <h3 class="confirm-prep-h">{BOOKING_COPY.confirmationPrepHeading}</h3>
      <ol class="prep-list">
        {BOOKING_COPY.prepItems.map((item, i) => (
          <li key={i}>
            <span class="prep-num">{String(i + 1).padStart(2, "0")}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
      <p class="confirm-footer">{BOOKING_COPY.confirmationFooter}</p>
    </div>
  );
}

export default function BookingIsland() {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [usingMock, setUsingMock] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      const real = await fetchAvailability(ac.signal);
      if (ac.signal.aborted) return;
      if (real) {
        setAvailability(real);
      } else {
        setAvailability(generateMockAvailability());
        setUsingMock(true);
      }
    })();
    return () => ac.abort();
  }, []);

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSubmit = Boolean(
    date && time && form.company.trim() && form.role.trim() && form.broken.trim()
  );

  async function onSubmit() {
    if (!date || !time) return;
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      await submitBooking({
        date,
        time,
        company: form.company,
        role: form.role,
        size: form.size,
        stack: form.stack,
        deliv: form.deliv,
        broken: form.broken,
        timeline: form.timeline,
      });
      setSubmitted(true);
    } catch (e) {
      if (e instanceof SlotTakenError) {
        setError(BOOKING_COPY.slotTakenError);
        // refresh availability so the taken slot now shows as struck-through
        const next = await fetchAvailability();
        if (next) setAvailability(next);
        setTime(null);
      } else if (e instanceof ValidationError) {
        setFieldErrors(e.fields);
      } else {
        setError(BOOKING_COPY.fallbackError);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted && date && time) {
    return <Confirmation when={dateLabel(availability?.dates ?? [], date)} time={time} />;
  }

  if (!availability) {
    return (
      <div class="booking-loading" aria-live="polite">
        <p class="body">Loading availability…</p>
      </div>
    );
  }

  const selectedSlots = date ? availability.slots[date] : undefined;

  return (
    <>
      <p class="salutation">{BOOKING_COPY.salutation}</p>
      <h1 class="headline" dangerouslySetInnerHTML={{ __html: BOOKING_COPY.headlineHtml }} />
      {BOOKING_COPY.bodyParagraphs.map((p, i) => (
        <p key={i} class="body">
          {p}
        </p>
      ))}

      <div class="divider" aria-hidden="true" />

      <h2 class="section-h">{BOOKING_COPY.sectionHeadings[0]}</h2>
      <DateStrip dates={availability.dates} value={date} onChange={setDate} />
      {usingMock ? (
        <p class="mock-note">Availability is sample data — backend endpoints aren't wired yet.</p>
      ) : null}

      {date && selectedSlots ? (
        <>
          <div class="reveal-gap" />
          <h2 class="section-h">{BOOKING_COPY.sectionHeadings[1]}</h2>
          <TimeGrid slots={selectedSlots} value={time} onChange={setTime} />
        </>
      ) : null}

      {time ? (
        <>
          <div class="divider" aria-hidden="true" />
          <h2 class="section-h">{BOOKING_COPY.sectionHeadings[2]}</h2>
          <p class="body form-blurb">{BOOKING_COPY.formBlurb}</p>

          <div class="form-grid">
            <Field
              label="Company"
              required
              value={form.company}
              onInput={(v) => setField("company", v)}
              error={fieldErrors["company"]}
            />
            <Field
              label="Your role"
              required
              value={form.role}
              placeholder="VP Eng, CTO, …"
              onInput={(v) => setField("role", v)}
              error={fieldErrors["role"]}
            />
            <SelectField
              label="Eng team size"
              value={form.size}
              options={TEAM_SIZES}
              onChange={(v) => setField("size", v)}
              error={fieldErrors["size"]}
            />
            <Field
              label="Stack"
              value={form.stack}
              placeholder="TS + Postgres, Go, Python…"
              onInput={(v) => setField("stack", v)}
              error={fieldErrors["stack"]}
            />
            <div class="field full-row" role="group" aria-labelledby="deliv-label">
              <span id="deliv-label" class="field-label">
                Which deliverable, if any, you're circling
              </span>
              <DelivTiles value={form.deliv} onChange={(v) => setField("deliv", v)} />
              {fieldErrors["deliv"] ? (
                <span class="field-error">{fieldErrors["deliv"]}</span>
              ) : null}
            </div>
            <label class="field full-row">
              <span class="field-label">Tell me, plainly, what's broken</span>
              <span class="field-hint">
                One paragraph. The thing that made you book this. No buzzwords — just what's
                happening.
              </span>
              <textarea
                class="textarea"
                value={form.broken}
                onInput={(e) => setField("broken", (e.currentTarget as HTMLTextAreaElement).value)}
                placeholder="The checkout flow has been quietly shipping bugs for two months. The tests all pass…"
              />
              {fieldErrors["broken"] ? (
                <span class="field-error">{fieldErrors["broken"]}</span>
              ) : null}
            </label>
            <SelectField
              label="Timeline"
              value={form.timeline}
              options={TIMELINES}
              onChange={(v) => setField("timeline", v)}
              fullRow
              error={fieldErrors["timeline"]}
            />
          </div>

          <div class="divider" aria-hidden="true" />
          <p class="body body-italic">{BOOKING_COPY.promise}</p>
          {error ? <p class="submit-error">{error}</p> : null}
          <button
            type="button"
            class="btn btn-wide"
            disabled={!canSubmit || submitting}
            onClick={onSubmit}
          >
            {submitting
              ? BOOKING_COPY.submitButtonLoading
              : BOOKING_COPY.submitButtonIdle(dateLabel(availability.dates, date), time)}
          </button>
          <div class="signature">{BOOKING_COPY.signature}</div>
          <div class="signoff-sub">{BOOKING_COPY.signoffSub}</div>
        </>
      ) : null}
    </>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onInput: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string | undefined;
}

function Field({ label, value, onInput, placeholder, required, error }: FieldProps) {
  return (
    <label class="field">
      <span class="field-label">
        {label}
        {required ? (
          <span class="field-req" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </span>
      <input
        class="input"
        type="text"
        value={value}
        onInput={(e) => onInput((e.currentTarget as HTMLInputElement).value)}
        placeholder={placeholder ?? ""}
      />
      {error ? <span class="field-error">{error}</span> : null}
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: ReadonlyArray<string>;
  onChange: (v: string) => void;
  fullRow?: boolean;
  error?: string | undefined;
}

function SelectField({ label, value, options, onChange, fullRow, error }: SelectFieldProps) {
  return (
    <label class={`field${fullRow ? " full-row" : ""}`}>
      <span class="field-label">{label}</span>
      <select
        class="select"
        value={value}
        onChange={(e) => onChange((e.currentTarget as HTMLSelectElement).value)}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error ? <span class="field-error">{error}</span> : null}
    </label>
  );
}
