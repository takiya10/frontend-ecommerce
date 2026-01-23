import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";

export interface SiteSettingsData {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    contactEmail: string;
    instagramUrl: string;
    whatsappNumber: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
    siteName: "Byher",
    siteDescription: "Modest fashion terbaik untuk wanita Indonesia.",
    maintenanceMode: false,
    contactEmail: "hello@byher.id",
    instagramUrl: "@byher.official",
    whatsappNumber: "+62 812-3456-7890"
};

export function useSiteSettings() {
    return useQuery({
        queryKey: ['settings', 'site_info'],
        queryFn: () => fetcher<SiteSettingsData>('/settings/site_info').catch(() => DEFAULT_SITE_SETTINGS),
        staleTime: 60000 * 5, // Cache for 5 minutes
        retry: false
    });
}
