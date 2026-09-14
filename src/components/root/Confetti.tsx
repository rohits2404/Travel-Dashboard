"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

type Props = {
    leftConfig: Parameters<typeof confetti>[0];
    rightConfig: Parameters<typeof confetti>[0];
};

export function Confetti({ leftConfig, rightConfig }: Props) {
    useEffect(() => {
        confetti(leftConfig);
        confetti(rightConfig);
    }, [leftConfig, rightConfig]);

    return null;
}
