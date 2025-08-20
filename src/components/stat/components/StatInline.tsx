import { cn } from "../../../utils/cn";
import { systemStatThresholds } from "../defaults/thresholds";
import { LabelType } from "../types/labelType";
import { Thresholds } from "../types/thresholds";

interface StatProps {
  Icon: React.ReactNode;
  stat: string;
  threshold?: Thresholds;
  value?: number;
}

export function StatInline({
  Icon,
  stat,
  threshold = systemStatThresholds,
  value,
}: StatProps) {
  function getNumbersFromString(str: string) {
    const numbers = str.match(/-?\d+/g)?.map(Number);
    return numbers && numbers.length > 0 ? numbers[0] : NaN;
  }

  function getThresholdLabel(value: number) {
    const range = threshold.find((r) => value >= r.min && value <= r.max);
    return range ? range.label : LabelType.DEFAULT;
  }

  const statAsInt = value !== undefined ? value : getNumbersFromString(stat);
  const thresholdLabel = getThresholdLabel(statAsInt);

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5",
        thresholdLabel === LabelType.DEFAULT && "text-text",
        thresholdLabel === LabelType.SUCCESS && "text-success",
        thresholdLabel === LabelType.WARNING && "text-warning",
        thresholdLabel === LabelType.DANGER && "text-danger"
      )}
    >
      {Icon}
      <p>{stat}</p>
    </div>
  );
}
