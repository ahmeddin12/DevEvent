import { useEffect } from "react";
import posthog from "posthog-js";

const usePostHog = () => {
    useEffect(() => {
        const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        if (posthogKey && typeof window !== "undefined" && !posthog.__loaded) {
            posthog.init(posthogKey, {
                api_host: "/ingest",
                ui_host: "https://us.posthog.com",
                capture_exceptions: true,
                debug: process.env.NODE_ENV === "development",
            });
        }
    }, []);
};

export default usePostHog;
