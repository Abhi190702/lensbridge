# Design

## Visual Language

LensBridge uses a dark graphite base, one cool accent, quiet borders, and direct product states. The video should be the
visual center. Decorative gradients, glass panels, and nested cards should be rare.

## Spacing

- Use `12px`, `16px`, `20px`, and `24px` for most layout gaps.
- Keep dashboards dense but breathable.
- Avoid nested cards unless a child card is a repeated item or a troubleshooting module.

## Typography

- Prefer direct headings: "Open OBS Output", "Phone connected", "Waiting for phone".
- Avoid marketing phrasing inside operational UI.
- Keep helper copy short and actionable.

## Color

- Base: dark graphite.
- Accent: LensBridge blue.
- Success: muted green.
- Warning: amber only for real caveats.
- Avoid purple-blue glow palettes and multi-accent gradients.

## Components

- Primary actions should be obvious and near the live stream.
- OBS Output Mode must have no app chrome when controls are hidden.
- Planned features must be labeled as planned.
- Troubleshooting cards should include cause, fix, and a copyable checklist.

## States

- Waiting for phone.
- Phone connected.
- Preview active.
- OBS output ready.
- OBS output open.
- Stream disconnected.
- Error with exact fix.

## Motion

Use short utility motion only. OBS controls may auto-hide after inactivity. Avoid decorative animation in capture surfaces.

## Anti-Patterns

- Claiming native virtual camera support before a driver exists.
- Capturing the normal dashboard in OBS.
- Showing QR cards, sidebars, metrics, or status bars in capture mode.
- Using fake data in production states.
- Adding TODO-heavy placeholders.
