# Product

## Audience

- Students and laptop users with weak or broken webcams.
- Creators who want their phone camera in calls or browser tools.
- Developers who prefer local, inspectable workflows.
- Open-source contributors who want a clean camera bridge foundation.

## Primary Job

Turn a phone camera into a usable webcam through a local, trustworthy workflow:

```text
Phone -> LensBridge Desktop -> LensBridge OBS Output -> OBS Virtual Camera -> browser/app
```

## Personality

Technical, calm, precise, and elegant. LensBridge should feel like a serious utility, not a generic SaaS dashboard.

## Anti-Goals

- Cloud accounts.
- Telemetry or tracking.
- Fake native camera claims.
- Complicated pairing.
- Confusing OBS setup.
- Decorative UI that competes with the video output.

## Current Truth

LensBridge does not currently install a native Windows, macOS, or Linux virtual camera device. It creates the live source.
OBS exposes that source as a system camera.
