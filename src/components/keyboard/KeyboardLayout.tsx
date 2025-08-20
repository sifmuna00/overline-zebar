import React from "react";
import { Keyboard } from "lucide-react";
import { Chip } from "../common/Chip";

interface KeyboardLayoutProps {
    layout: string | undefined;
}

export const KeyboardLayout: React.FC<KeyboardLayoutProps> = ({ layout }) => {
    if (!layout) return null;

    // Format the layout string to be more user-friendly
    const formatLayout = (layout: string) => {
        // Handle common layout formats
        if (layout.includes('-')) {
            return layout.split('-')[0].toUpperCase(); // e.g., "en-US" -> "EN"
        }
        return layout.toUpperCase();
    };

    return (
        <Chip className="flex items-center gap-1.5 h-full">
            <Keyboard className="h-3 w-3 text-icon" strokeWidth={3} />
            <span className="text-xs font-medium text-text">
                {formatLayout(layout)}
            </span>
        </Chip>
    );
};
