import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../utils/cx';

export interface AccordionItem { question: string; answer: string }

export const Accordion: React.FC<{ items: AccordionItem[] }> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white shadow-card">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-sans text-base font-semibold hover:bg-ink-50"
              >
                {item.question}
                <ChevronDown aria-hidden="true" className={cx('h-5 w-5 shrink-0 text-ink-500 transition-transform', open && 'rotate-180')} />
              </button>
            </h3>
            <div id={panelId} role="region" hidden={!open} className="px-5 pb-5 text-sm leading-relaxed text-ink-500">
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
};