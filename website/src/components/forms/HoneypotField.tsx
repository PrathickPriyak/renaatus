"use client";

export function HoneypotField() {
  return (
    <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="company-website">Company website</label>
      <input
        id="company-website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
