# WirelessOffice Web App

WirelessOffice is now a web app scaffold that mirrors the same core flows we started on mobile:

- Onboarding and permission readiness
- BLE device list simulation
- Device detail view
- Diagnostics log workflow

## Requirements

- Node.js 20+
- npm 10+

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in terminal (typically `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Notes

- Current BLE/permissions are mocked using in-memory fake APIs in `src/data/mockApi.ts`.
- The existing Android scaffold remains in `app/` for reference during migration.

## Reports

- [Dillon Tower APK deconstruction](reports/dillon-tower-apk-deconstruction.md)
