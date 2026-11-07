"use client";

import { useState } from "react";

type Props = {
    url?: string | null;
    name?: string;
    size?: number;
};

export default function Avatar({ url, name, size = 46 }: Props) {
    const [brokenUrl, setBrokenUrl] = useState("");

    if (url && url !== brokenUrl) {
        return (
            <img
                src={url}
                alt={name ?? "Avatar"}
                className="rounded-circle object-fit-cover border flex-shrink-0"
                width={size}
                height={size}
                onError={() => setBrokenUrl(url)}
            />
        );
    }

    const initials = name
        ?.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase();

    return (
        <span
            className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold flex-shrink-0 bg-success-subtle"
            style={{ width: size, height: size }}
        >
            {initials || <small className="fw-normal">Sem foto</small>}
        </span>
    );
}
