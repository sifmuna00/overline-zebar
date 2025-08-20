import { Download, Upload, Wifi, WifiOff } from "lucide-react";
import { NetworkOutput } from "zebar";

export function getNetworkIcon(network: NetworkOutput, className?: string) {
	if (!network.defaultInterface) {
		return <WifiOff className={className} />;
	}

	return <Wifi className={className} />;
}

export function getNetworkSpeedIcon(type: 'download' | 'upload', className?: string) {
	return type === 'download' ? (
		<Download className={className} />
	) : (
		<Upload className={className} />
	);
}

export function formatNetworkSpeed(bytes: number): string {
	if (bytes === 0) return "0 B/s";

	const k = 1024;
	const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getNetworkSpeedInMBps(bytes: number): number {
	return bytes / (1024 * 1024);
}
