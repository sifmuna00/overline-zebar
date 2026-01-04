import React from "react";
import { Keyboard } from "lucide-react";
import { Chip } from "../common/Chip";
import { GlazeWmOutput, shellExec } from "zebar";

interface KeyboardLayoutProps {
    layout: string | undefined;
    glazewm: GlazeWmOutput | null | undefined;
}

const PS_SCRIPT_TEMPLATE = `
$TargetHwnd = {{HANDLE_PLACEHOLDER}}

$code = @'
using System;
using System.Runtime.InteropServices;

namespace ZebarKeyboardSwitcher {
    public class WinAPI {
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        public static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        [DllImport("user32.dll")]
        public static extern IntPtr GetKeyboardLayout(uint idThread);

        [DllImport("user32.dll")]
        public static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

        [DllImport("user32.dll")]
        public static extern int GetKeyboardLayoutList(int nBuff, [Out] IntPtr[] lpList);
    }
}
'@

if (-not ([System.Management.Automation.PSTypeName]'ZebarKeyboardSwitcher.WinAPI').Type) {
    Add-Type -TypeDefinition $code
}

$count = [ZebarKeyboardSwitcher.WinAPI]::GetKeyboardLayoutList(0, $null)
$hklList = New-Object IntPtr[] $count
[ZebarKeyboardSwitcher.WinAPI]::GetKeyboardLayoutList($count, $hklList) | Out-Null

if ($TargetHwnd -ne 0) {
    $hwnd = [IntPtr]$TargetHwnd
    [ZebarKeyboardSwitcher.WinAPI]::SetForegroundWindow($hwnd)
} else {
    $hwnd = [ZebarKeyboardSwitcher.WinAPI]::GetForegroundWindow()
}

$windowPid = 0
$threadId = [ZebarKeyboardSwitcher.WinAPI]::GetWindowThreadProcessId($hwnd, [ref]$windowPid)
$currentHkl = [ZebarKeyboardSwitcher.WinAPI]::GetKeyboardLayout($threadId)

$currentIndex = -1
for ($i = 0; $i -lt $hklList.Count; $i++) {
    if ($hklList[$i] -eq $currentHkl) {
        $currentIndex = $i
        break
    }
}

if ($currentIndex -eq -1) { $currentIndex = 0 }

$nextIndex = ($currentIndex + 1) % $hklList.Count
$targetHkl = $hklList[$nextIndex]

$WM_INPUTLANGCHANGEREQUEST = 0x0050
[ZebarKeyboardSwitcher.WinAPI]::PostMessage($hwnd, $WM_INPUTLANGCHANGEREQUEST, [IntPtr]::Zero, $targetHkl)
`;

export const KeyboardLayout: React.FC<KeyboardLayoutProps> = ({ layout, glazewm }) => {
    if (!layout) return null;

    // Format the layout string to be more user-friendly
    const formatLayout = (layout: string) => {
        // Handle common layout formats
        if (layout.includes('-')) {
            return layout.split('-')[0].toUpperCase(); // e.g., "en-US" -> "EN"
        }
        return layout.toUpperCase();
    };

    const cycleLayout = async () => {
        const handle = (glazewm?.focusedContainer as any)?.handle;
        const script = PS_SCRIPT_TEMPLATE.replace('{{HANDLE_PLACEHOLDER}}', (handle || 0).toString());
        
        // Encode to UTF-16LE Base64 for PowerShell -EncodedCommand
        const codePoints = [];
        for (let i = 0; i < script.length; i++) {
            codePoints.push(script.charCodeAt(i) & 0xff);
            codePoints.push((script.charCodeAt(i) >> 8) & 0xff);
        }
        
        let binary = '';
        const bytes = new Uint8Array(codePoints);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const encodedCommand = window.btoa(binary);

        try {
            await shellExec("powershell", [
                "-NoProfile",
                "-EncodedCommand", encodedCommand
            ]);
        } catch (e) {
            console.error("Failed to switch keyboard layout:", e);
        }
    };

    return (
        <Chip
            as="button"
            onClick={cycleLayout}
            className="flex items-center gap-1.5 h-full cursor-pointer"
        >
            <Keyboard className="h-3 w-3 text-icon" strokeWidth={3} />
            <span className="text-xs font-medium text-text">
                {formatLayout(layout)}
            </span>
        </Chip>
    );
};
