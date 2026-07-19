import type { Metadata } from "next";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingWhy } from "@/components/landing/LandingWhy";

export const metadata: Metadata = {
  title: "BudgetFreely — EMIs, subscriptions, clear numbers",
  description:
    "Open-source personal finance built around recurring obligations, card-aware spend, and analytics you can trust.",
  openGraph: {
    title: "BudgetFreely",
    description:
      "See every EMI and subscription. Know which card paid.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <LandingHeader />
      <LandingHero />
      <LandingWhy />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
