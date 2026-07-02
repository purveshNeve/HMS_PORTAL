"use client";

import { motion } from "framer-motion";
import { pipelineFunnel } from "@/lib/mock-data";

const colors = ["#0B2B26", "#1A4F42", "#227A5F", "#3F9078", "#C9A24B", "#DDB966"];

export function PipelineFunnelChart() {
  const max = pipelineFunnel[0].value;

  return (
    <div className="space-y-3.5">
      {pipelineFunnel.map((stage, i) => {
        const pct = (stage.value / max) * 100;
        const conversion = i === 0 ? 100 : Math.round((stage.value / pipelineFunnel[i - 1].value) * 100);
        return (
          <div key={stage.stage} className="group">
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium text-ink-600 dark:text-ink-300">{stage.stage}</span>
              <span className="font-mono text-ink-400">
                {stage.value.toLocaleString()} {i > 0 && <span className="text-ink-300">· {conversion}%</span>}
              </span>
            </div>
            <div className="h-8 w-full overflow-hidden rounded-lg bg-ink-50 dark:bg-ink-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                className="h-full rounded-lg"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
