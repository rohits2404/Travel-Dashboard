"use client";

import { PagerComponent } from "@syncfusion/ej2-react-grids";
import { useRouter } from "next/navigation";

type TravelPagerProps = {
    total: number;
    pageSize: number;
    currentPage: number;
};

export function TravelPager({
    total,
    pageSize,
    currentPage,
}: TravelPagerProps) {
    const router = useRouter();

    const handlePageChange = (args: { currentPage: number }) => {
        router.push(`/travel?page=${args.currentPage}#trips`);
    };

    return (
        <PagerComponent
            totalRecordsCount={total}
            pageSize={pageSize}
            currentPage={currentPage}
            click={handlePageChange}
            cssClass="!mb-4"
        />
    );
}
