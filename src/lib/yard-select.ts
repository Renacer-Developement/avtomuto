import { yardGroups } from '../data/auction-yards';
import type { AuctionKey } from '../data/import-calculator';

/** Перебудовує список майданчиків під аукціон, намагаючись лишити вибраним той самий штат. */
export function fillYardSelect(select: HTMLSelectElement, auction: AuctionKey) {
  const previous = select.value;
  select.replaceChildren(
    ...yardGroups(auction).map((group) => {
      const og = document.createElement('optgroup');
      og.label = group.label;
      og.append(...group.yards.map((y) => new Option(y.label, y.value)));
      return og;
    }),
  );
  const options = [...select.options];
  const same = options.find((o) => o.value === previous) ?? options.find((o) => o.value.slice(0, 2) === previous.slice(0, 2));
  if (same) select.value = same.value;
}
