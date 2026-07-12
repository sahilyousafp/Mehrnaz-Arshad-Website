"use client";

// Thin wrappers around @vercel/analytics' custom `track()` so every call
// site logs a consistent event name/property shape. Page views are tracked
// automatically by <Analytics/> in app/layout.tsx - these cover the click
// events product/marketing asked for on top of that: one event per project
// (so each project's click volume is visible on its own in the dashboard),
// plus separate events for contact/LinkedIn/email link clicks.

import { track } from "@vercel/analytics";

export function trackProjectClick(slug: string, client: string) {
  track(`project_click_${slug}`, { client });
}

export function trackContactClick(source: string) {
  track("contact_click", { source });
}

export function trackLinkedinClick(source: string) {
  track("linkedin_click", { source });
}

export function trackEmailClick(source: string) {
  track("email_click", { source });
}
