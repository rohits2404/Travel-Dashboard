"use client";

import { useRouter, useSearchParams } from "next/navigation";

type PagerProps = {
    total: number;
    pageSize: number;
    currentPage: number;
};

export const Pager = ({ total, pageSize, currentPage }: PagerProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(total / pageSize);

    if (totalPages <= 1) {
        return null;
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (page === 1) {
            params.delete("page");
        } else {
            params.set("page", String(page));
        }

        const query = params.toString();

        router.push(query ? `?${query}` : "?");
    };

    return (
        <div className="flex items-center justify-center gap-2 mb-4">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 rounded-md border disabled:opacity-50"
            >
                Previous
            </button>

            <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
            </span>

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 rounded-md border disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};
