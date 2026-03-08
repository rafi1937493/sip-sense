declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    scope?: string;
    sw?: string;
    cacheOnFrontEndNav?: boolean;
    aggressiveFrontEndNavCaching?: boolean;
    reloadOnOnline?: boolean;
    swcMinify?: boolean;
    disable?: boolean;
    buildId?: string;
    manifest?: {
      name?: string;
      short_name?: string;
      description?: string;
      theme_color?: string;
      background_color?: string;
      display?: string;
      orientation?: string;
      start_url?: string;
      scope?: string;
      icons?: Array<{
        src: string;
        sizes?: string;
        type?: string;
        purpose?: string;
      }>;
      categories?: string[];
      lang?: string;
      dir?: string;
      screenshots?: Array<{
        src: string;
        sizes?: string;
        type?: string;
        form_factor?: string;
      }>;
      shortcuts?: Array<{
        name: string;
        short_name?: string;
        description?: string;
        url: string;
        icons?: Array<{
          src: string;
          sizes?: string;
        }>;
      }>;
      related_applications?: Array<{
        platform: string;
        url: string;
        id?: string;
      }>;
      prefer_related_applications?: boolean;
    };
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}
