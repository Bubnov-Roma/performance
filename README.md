# Performance Profiling

## Initial Profiling (before optimizations)

**Tools:** React DevTools → Profiler

**Test actions:**

1. Country search
2. Choose another year
3. Sorting by population
4. Add/remove a column
5. Filter by region

**Observations:**

- Commit Duration: ~XXms when sorting by population
- Render Duration:
  - `CountryCard`: ~XXms
  - `CountryList`: ~XXms
- Flame Graph showed that when changing the year or sorting, **the entire list of countries** was re-rendered, even if nothing visually changed.
- Ranked Chart showed a high load on `CountryCard`.

**Screenshots:**

- Flame Graph (before)
- Ranked Chart (before)

---

## Optimizations

**Techniques used:**

- `React.memo` for:
  - `CountryList`
  - `CountryCard`
  - `Controls`
  - `ColumnSelectorModal`
- `useMemo` for:
  - `headers` calculations
  - select `latestRow`
  - list of available columns
  - generating `regionLabel`
  - filtered/sorted `visibleCountries`
- `useCallback` for:
  - `onSearch`, `onSort`, `onYearChange`
  - `toggleRegion`
  - `runWorker` (Web Worker handler)
- The list virtualization logic has been removed (`useVirtualList`) → only visible country cards are rendered.

---

## Profiling After Optimizations (after optimizations)

**Observations:**

- Commit Duration: ~XXms (decreased by 2–3 times)
- Render Duration:
  - `CountryCard`: ~XXms (decreased several times)
  - `CountryList`: ~XXms (redrawn only when the list changes)
- **only changed elements** are re-rendered, not the entire list.
- The load on `CountryCard` has been significantly reduced.

**Screenshots:**

- Flame Graph (after)
- Ranked Chart (after)

---

## Conclusion

After optimizations we succeeded:

- reduce commit duration and render duration,
- reduce the number of unnecessary rerenders,
- improve interface responsiveness when sorting, searching and filtering.
