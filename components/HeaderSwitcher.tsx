"use client";

import { usePathname } from "next/navigation";
import LandingHeader from "./LandingHeader";
import GameHeader from "./GameHeader";

export default function HeaderSwitcher() {
  const pathname = usePathname();
  const isPlayRoute = pathname?.startsWith("/play");

  return isPlayRoute ? <GameHeader /> : <LandingHeader />;
}
