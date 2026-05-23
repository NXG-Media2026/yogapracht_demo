export type EventName =
  // Cluster pageviews
  | 'expert_growth_cluster_pageview'
  | 'ai_vindbaarheid_cluster_pageview'
  // Content pageviews
  | 'case_study_pageview'
  | 'product_pageview'
  // Service views
  | 'expert_growth_service_view'
  | 'ai_vindbaarheid_service_view'
  // Calendly
  | 'expert_growth_calendly_open'
  | 'ai_vindbaarheid_calendly_open'
  // Calls booked
  | 'expert_growth_call_booked'
  | 'ai_vindbaarheid_call_booked'
  // Scanner
  | 'scanner_request_submitted'
  // Products
  | 'instagram_playbook_purchase'
  | 'diy_boekjes_purchase'
  | 'product_checkout_click'
  // Social & newsletter
  | 'social_storytelling_card_click'
  | 'newsletter_signup'
  // General
  | 'faq_expand'
  | 'external_link_click'
  | 'cross_cluster_link_click';

export type PageType =
  | 'homepage'
  | 'cluster_hub'
  | 'service'
  | 'product'
  | 'case'
  | 'guide'
  | 'about'
  | 'contact'
  | 'page';

export type CTALocation =
  | 'hero'
  | 'sticky_mobile'
  | 'inline'
  | 'footer'
  | 'sidebar'
  | 'product_bottom'
  | 'header';

export interface EventProperties {
  page_type: PageType;
  page_slug: string;
  locale: string;
  cluster?: string;
  source_cluster?: string;
  source_page_type?: PageType;
  source_page_slug?: string;
  product_type?: string;
  cta_location?: CTALocation;
  provider?: string;
  product?: string;
  target_cluster?: string;
}

export function getTrackingScript(): string {
  return [
    'window.trackEvent=function(n,p){',
    "if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){",
    "console.log('[Analytics]',n,p);return}",
    "if(typeof gtag==='function'){gtag('event',n,p)}",
    '};',
  ].join('');
}

export function getGA4Script(measurementId: string): string {
  if (!measurementId) return '';

  return (
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>` +
    '<script>window.dataLayer=window.dataLayer||[];' +
    'function gtag(){dataLayer.push(arguments)}' +
    "gtag('js',new Date());" +
    `gtag('config','${measurementId}');</script>`
  );
}

export function getMetaPixelScript(pixelId: string): string {
  if (!pixelId) return '';

  return (
    '<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function()' +
    '{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};' +
    'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';n.queue=[];' +
    "t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];" +
    "s.parentNode.insertBefore(t,s)}(window,document,'script'," +
    "'https://connect.facebook.net/en_US/fbevents.js');" +
    `fbq('init','${pixelId}');fbq('track','PageView');</script>` +
    `<noscript><img height="1" width="1" style="display:none" ` +
    `src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" /></noscript>`
  );
}

export function trackOnClick(name: EventName, props: EventProperties): string {
  return `trackEvent('${name}',${JSON.stringify(props)})`;
}
