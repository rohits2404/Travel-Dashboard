"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
    title: string;
    description: string;
    ctaText?: string;
    ctaUrl?: string;
}

export const Header = ({ title, description, ctaText, ctaUrl }: Props) => {
    const pathname = usePathname();

    return (
        <header className="header">
            <article>
                <h1
                    className={cn(
                        "text-dark-100",
                        pathname === "/"
                            ? "text-2xl md:text-4xl font-bold"
                            : "text-xl md:text-2xl font-semibold",
                    )}
                >
                    {title}
                </h1>

                <p
                    className={cn(
                        "text-gray-100 font-normal",
                        pathname === "/"
                            ? "text-base md:text-lg"
                            : "text-sm md:text-lg",
                    )}
                >
                    {description}
                </p>
            </article>

            {ctaText && ctaUrl && (
                <Link
                    href={ctaUrl}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 transition-colors hover:bg-primary-600"
                >
                    <img
                        src="/assets/icons/plus.svg"
                        alt=""
                        aria-hidden="true"
                        className="size-5"
                    />

                    <span className="p-16-semibold text-white">{ctaText}</span>
                </Link>
            )}
        </header>
    );
};
