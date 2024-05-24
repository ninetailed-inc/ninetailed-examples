import Script from 'next/script';
import { LyticsTracker } from '../LyticsTracker';

export function ThirdPartyScripts() {
  return (
    <>
      {/* GTM */}
      {process.env.NEXT_PUBLIC_GTM_ID ? (
        <Script
          id="gtm-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${
    process.env.NEXT_PUBLIC_GTM_ID || ''
  }');`,
          }}
        />
      ) : (
        ''
      )}

      {/* Segment */}
      {process.env.NEXT_PUBLIC_SEGMENT_ID ? (
        <Script
          id="segment"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="${process.env.NEXT_PUBLIC_SEGMENT_ID}";;analytics.SNIPPET_VERSION="5.2.0";
        analytics.load("${process.env.NEXT_PUBLIC_SEGMENT_ID}");
        analytics.page();
        }}();`,
          }}
        />
      ) : (
        ''
      )}

      {/* Lytics */}
      {process.env.NEXT_PUBLIC_LYTICS_ID ? (
        <>
          <Script
            id="lytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(){"use strict";var o=window.jstag||(window.jstag={}),r=[];function n(e){o[e]=function(){for(var n=arguments.length,t=new Array(n),i=0;i<n;i++)t[i]=arguments[i];r.push([e,t])}}n("send"),n("mock"),n("identify"),n("pageView"),n("unblock"),n("getid"),n("setid"),n("loadEntity"),n("getEntity"),n("on"),n("once"),n("call"),o.loadScript=function(n,t,i){var e=document.createElement("script");e.async=!0,e.src=n,e.onload=t,e.onerror=i;var o=document.getElementsByTagName("script")[0],r=o&&o.parentNode||document.head||document.body,c=o||r.lastChild;return null!=c?r.insertBefore(e,c):r.appendChild(e),this},o.init=function n(t){return this.config=t,this.loadScript(t.src,function(){if(o.init===n)throw new Error("Load error!");o.init(o.config),function(){for(var n=0;n<r.length;n++){var t=r[n][0],i=r[n][1];o[t].apply(o,i)}r=void 0}()}),this}}();
          // Define config and initialize Lytics tracking tag.
          // - The setup below will disable the automatic sending of Page Analysis Information (to prevent duplicative sends, as this same information will be included in the jstag.pageView() call below, by default)
          jstag.init({
            src: 'https://c.lytics.io/api/tag/1cf4759a89f5763e19a414c02424cb8c/latest.min.js',
            pageAnalysis: {
              dataLayerPull: {
                disabled: true
              }
            }
          })`,
            }}
          />
          <LyticsTracker />
        </>
      ) : (
        ''
      )}
    </>
  );
}

// You may need to send a page view, depending on your use-case
// jstag.pageView();
