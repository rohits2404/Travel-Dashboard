"use client";

import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

type Props = {
    paymentLink: string;
    estimatedPrice: string;
};

export function PayTripButton({ paymentLink, estimatedPrice }: Props) {
    return (
        <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex"
        >
            <ButtonComponent className="button-class" type="button">
                <span className="p-16-semibold text-white">
                    Pay To Join The Trip
                </span>

                <span className="price-pill">{estimatedPrice}</span>
            </ButtonComponent>
        </a>
    );
}
