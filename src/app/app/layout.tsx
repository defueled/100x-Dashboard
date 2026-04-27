import type { Metadata } from "next";
import { Web3Provider } from "@/components/providers/Web3Provider";

export const metadata: Metadata = {
    robots: { index: false, follow: false, nocache: true },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <Web3Provider>{children}</Web3Provider>;
}
