'use client'
import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";

export function ProviderNextUI({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}