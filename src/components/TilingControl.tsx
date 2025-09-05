import { ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "./common/Button";
import { GlazeWmOutput } from "zebar";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "../context/ConfigContext";

interface TilingControlProps {
  glazewm: GlazeWmOutput | null;
}

export function TilingControl({ glazewm }: TilingControlProps) {
  const { flowLauncherPath, isLoading } = useConfig();

  if (!glazewm) return null;

  const handleWMTogglePause = () => {
    glazewm.runCommand('wm-toggle-pause');
  };

  return (
    <>
      <AnimatePresence>
        {glazewm.bindingModes.map((bindingMode) => (
          <motion.div
            key={bindingMode.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <Button>{bindingMode.displayName ?? bindingMode.name}</Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        onClick={handleWMTogglePause}
        className={cn(
          glazewm.isPaused && "text-red-500 hover:text-red-400"
        )}
      >
        {glazewm.isPaused ? (
          <Play strokeWidth={2} className="h-3 w-3" />
        ) : (
          <Pause strokeWidth={2} className="h-3 w-3" />
        )}
      </Button>

      <Button onClick={() => glazewm.runCommand("toggle-tiling-direction")}>
        <ChevronRight
          className={cn(
            "h-3 w-3 transition-transform duration-200 ease-in-out",
            glazewm.tilingDirection === "vertical" ? "rotate-90" : ""
          )}
          strokeWidth={3}
        />
      </Button>
    </>
  );
}
