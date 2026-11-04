# Agent rules

- Data access only through `src/server/repositories/*`. No queries in routes.
- Errors: throw `AppError` from `src/server/errors.ts`; routes never send stack traces.
- Tests live next to the file (`*.test.ts`) and use vitest.
- UI: reuse components from `src/web/components/ui`; never add a new UI library.
- All user-facing strings go in `src/web/locales/<lang>/*.json` (en and pt-BR).
- Do not import from `src/legacy/`; it is being removed.
