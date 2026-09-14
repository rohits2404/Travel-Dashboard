"use client";

import {
    ChipDirective,
    ChipListComponent,
    ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

import { getFirstWord } from "@/lib/utils";

type PillItem = {
    text: string;
    bg: string;
};

type Props = {
    items: PillItem[];
};

export function TravelDetailChips({ items }: Props) {
    return (
        <section className="flex gap-3 md:gap-5 items-center flex-wrap">
            <ChipListComponent id="travel-chip">
                <ChipsDirective>
                    {items.map((pill, index) => (
                        <ChipDirective
                            key={index}
                            text={getFirstWord(pill.text)}
                            cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                        />
                    ))}
                </ChipsDirective>
            </ChipListComponent>

            <ul className="flex gap-1 items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                    <li key={index}>
                        <img
                            src="/assets/icons/star.svg"
                            alt="star"
                            className="size-4.5"
                        />
                    </li>
                ))}

                <li className="ml-1">
                    <ChipListComponent>
                        <ChipsDirective>
                            <ChipDirective
                                text="4.9/5"
                                cssClass="!bg-yellow-50 !text-yellow-700"
                            />
                        </ChipsDirective>
                    </ChipListComponent>
                </li>
            </ul>
        </section>
    );
}
