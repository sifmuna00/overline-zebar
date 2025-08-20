import {
    Battery,
    BatteryCharging,
    BatteryFull,
    BatteryLow,
    BatteryMedium,
    BatteryWarning,
} from "lucide-react";
import { BatteryOutput } from "zebar";

export const getBatteryIcon = (
    batteryOutput: BatteryOutput,
    iconClass: string
) => {
    const { chargePercent, state, isCharging } = batteryOutput;

    // If charging, always show charging icon regardless of level
    if (isCharging || state === "charging") {
        return <BatteryCharging className={iconClass} strokeWidth={3} />;
    }

    // If full state
    if (state === "full") {
        return <BatteryFull className={iconClass} strokeWidth={3} />;
    }

    // If empty state or very low
    if (state === "empty" || chargePercent <= 5) {
        return <BatteryWarning className={iconClass} strokeWidth={3} />;
    }

    // Based on charge percentage
    if (chargePercent <= 20) {
        return <BatteryLow className={iconClass} strokeWidth={3} />;
    } else if (chargePercent <= 50) {
        return <BatteryMedium className={iconClass} strokeWidth={3} />;
    } else if (chargePercent >= 95) {
        return <BatteryFull className={iconClass} strokeWidth={3} />;
    } else {
        return <Battery className={iconClass} strokeWidth={3} />;
    }
};
