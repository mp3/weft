---
description: Regenerate PWA icons from public/icon.svg. Produces all PNG sizes (192, 512, maskable, apple-touch-icon).
---

# Generate Icons

Regenerate all PWA icon PNGs from the source SVG.

## When to Use

- After modifying `public/icon.svg` (logo, colors, shape)
- After changing icon sizes or adding new sizes in `app/manifest.ts`

## Workflow

1. **Run the generation script**
   ```bash
   node scripts/generate-icons.mjs
   ```

2. **Verify the output**
   Confirm these files exist in `public/`:
   - `icon-192x192.png` (standard 192x192)
   - `icon-512x512.png` (standard 512x512)
   - `icon-maskable-192x192.png` (maskable with padding)
   - `icon-maskable-512x512.png` (maskable with padding)
   - `apple-touch-icon.png` (180x180)

3. **Check manifest consistency**
   - Read `app/manifest.ts` and verify all icon entries match generated files
   - If new sizes were added to the manifest, update `scripts/generate-icons.mjs` to generate them

4. **Show the user a summary**
   List all generated files with their sizes.

## Notes

- The script uses `sharp` (devDependency) to convert SVG → PNG
- Maskable icons include padding (safe zone) for adaptive icon display
- The source SVG is at `public/icon.svg`
- If `sharp` is not installed, run `pnpm add -D sharp` first
