# OSF Front-end Developers' Handbook

This in-repo addon represents a chunk of app that might be excluded at build time.
It is a weird addon in that it does not use `addon/`, but instead puts everything in `app/`.

Declare routes in `app/handbook-routes.ts` and implement them under `app/`.
