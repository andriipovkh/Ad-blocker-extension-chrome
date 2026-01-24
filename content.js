// ==UserScript==
// @name         Universal Ad Blocker (Google & LinkedIn)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Removes Google, LinkedIn, YouTube, Reddit, Twitter/X, overlay, banner, srv224, bashirian.biz and Sevio ads from all websites
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('Universal Ad Blocker (Google & LinkedIn) loaded...');
    
    // Function to remove Google ads and LinkedIn ads
    function removeGoogleAds() {
        let adsRemoved = 0;
        
        // Remove Google ad iframes
        const adIframes = document.querySelectorAll('iframe[id*="google_ads"], iframe[src*="googlesyndication"], iframe[src*="doubleclick"], iframe[data-google-container-id]');
        adIframes.forEach(iframe => {
            iframe.remove();
            adsRemoved++;
        });
        
        // Remove ad containers
        const adContainers = document.querySelectorAll(
            '[id*="google_ads"], ' +
            '[class*="google_ads"], ' +
            '[id*="sda-"], ' +
            '.sdaContainer, ' +
            '[id*="google_ad"], ' +
            '[class*="google_ad"], ' +
            'div[id*="ad-"], ' +
            'div[class*="ad-container"], ' +
            'div[aria-label="Advertisement"]'
        );
        adContainers.forEach(container => {
            // Check if it's actually an ad container
            if (container.innerHTML.includes('google') || 
                container.innerHTML.includes('advertisement') ||
                container.querySelector('iframe[src*="google"]')) {
                container.remove();
                adsRemoved++;
            }
        });
        
        // Remove specific ad slots
        const adSlots = document.querySelectorAll('[data-google-query-id]');
        adSlots.forEach(slot => {
            slot.remove();
            adsRemoved++;
        });
        
        // Remove ins elements (AdSense)
        const adsenseElements = document.querySelectorAll('ins.adsbygoogle, ins[class*="adsbygoogle"]');
        adsenseElements.forEach(ins => {
            ins.remove();
            adsRemoved++;
        });
        
        // Remove LinkedIn sponsored ads
        const linkedinAds = document.querySelectorAll(
            '#ads-container, ' +
            '[id="ads-container"], ' +
            'div[data-creative*="sponsoredCreative"], ' +
            'div[data-account*="sponsoredAccount"], ' +
            '.da-card-creative, ' +
            'div.da, ' +
            'div[class*="da--"], ' +
            '.ad-banner-container, ' +
            'section.ad-banner-container, ' +
            'iframe[data-ad-banner], ' +
            'iframe.ad-banner'
        );
        linkedinAds.forEach(ad => {
            // Double-check it's a LinkedIn ad
            if (ad.querySelector('.al__label') || 
                ad.querySelector('[class*="da-card"]') ||
                ad.innerHTML.includes('sponsoredCreative') ||
                ad.classList.contains('ad-banner-container') ||
                ad.querySelector('iframe[data-ad-banner]') ||
                ad.querySelector('iframe.ad-banner')) {
                ad.remove();
                adsRemoved++;
            }
        });
        
        // Remove banner ads (like unit_list_banner, nts-ad, sevio ads)
        const bannerAds = document.querySelectorAll(
            '.unit_list_banner, ' +
            '.banner, ' +
            '.nts-ad, ' +
            '[class*="nts-ad"], ' +
            '.advtext, ' +
            '.sevioads, ' +
            '[class*="sevioads"], ' +
            '[id*="sevio"], ' +
            '[id*="wrapper-sevio"], ' +
            '.noindex-section, ' +
            '[data-nosnippet]'
        );
        bannerAds.forEach(banner => {
            // Check if it's an ad banner
            if (banner.classList.contains('unit_list_banner') ||
                banner.querySelector('.advtext') ||
                banner.querySelector('.nts-ad') ||
                banner.classList.contains('nts-ad') ||
                banner.classList.contains('sevioads') ||
                banner.id.includes('sevio') ||
                banner.querySelector('.sevioads') ||
                banner.querySelector('[id*="sevio"]') ||
                banner.innerHTML.includes('Реклама') ||
                banner.innerHTML.includes('adx.ws') ||
                banner.innerHTML.includes('czilladx.com')) {
                banner.remove();
                adsRemoved++;
            }
        });
        
        // Remove ad labels/badges
        const adLabels = document.querySelectorAll('span.bg-white');
        adLabels.forEach(label => {
            if (label.textContent.trim() === 'Ad') {
                const parent = label.closest('.position-relative');
                if (parent) {
                    parent.remove();
                    adsRemoved++;
                }
            }
        });
        
        // Remove YouTube ads
        const youtubeAds = document.querySelectorAll(
            'ytd-ad-slot-renderer, ' +
            'ytd-in-feed-ad-layout-renderer, ' +
            'ytd-rich-item-renderer:has(ytd-ad-slot-renderer), ' +
            '.ytd-ad-slot-renderer, ' +
            'ad-slot-renderer, ' +
            '[class*="ad-slot"], ' +
            '[class*="AdSlot"]'
        );
        youtubeAds.forEach(ad => {
            // Check if it's a YouTube ad
            if (ad.tagName === 'YTD-AD-SLOT-RENDERER' ||
                ad.tagName === 'YTD-IN-FEED-AD-LAYOUT-RENDERER' ||
                ad.querySelector('ytd-ad-slot-renderer') ||
                ad.querySelector('ytd-in-feed-ad-layout-renderer') ||
                ad.querySelector('[class*="ytwTopLandscapeImageLayoutViewModelHost"]') ||
                ad.querySelector('ad-badge-view-model')) {
                ad.remove();
                adsRemoved++;
            }
        });
        
        // Remove Reddit ads
        const redditAds = document.querySelectorAll(
            'shreddit-comments-page-ad, ' +
            '[class*="promotedlink"], ' +
            'shreddit-ad-post, ' +
            '[slot="full-comments-page-ad-link"], ' +
            '[data-testid*="promoted"], ' +
            '[class*="promoted"]'
        );
        redditAds.forEach(ad => {
            // Check if it's a Reddit ad
            if (ad.tagName === 'SHREDDIT-COMMENTS-PAGE-AD' ||
                ad.classList.contains('promotedlink') ||
                ad.tagName === 'SHREDDIT-AD-POST' ||
                ad.querySelector('shreddit-dynamic-ad-link') ||
                ad.querySelector('[class*="promoted-name-container"]') ||
                ad.querySelector('[class*="promoted-label"]') ||
                ad.hasAttribute('post-promoted') ||
                ad.innerHTML.includes('alb.reddit.com')) {
                ad.remove();
                adsRemoved++;
            }
        });
        
        // Remove Twitter/X ads
        const twitterAds = document.querySelectorAll(
            'article[data-testid="tweet"]'
        );
        twitterAds.forEach(tweet => {
            // Check if it contains "Ad" label or ad tracking
            const adLabel = tweet.querySelector('[class*="css-146c3p1"]:has([class*="css-1jxf684"])');
            const hasAdText = adLabel && (adLabel.textContent === 'Ad' || adLabel.textContent.includes('Ad'));
            const hasAdTracking = tweet.querySelector('[data-testid="placementTracking"]');
            const hasDoubleClickUrl = tweet.innerHTML.includes('doubleclick.net');
            
            if (hasAdText || hasAdTracking || hasDoubleClickUrl) {
                // Find the parent container
                const container = tweet.closest('[data-testid="cellInnerDiv"]');
                if (container) {
                    container.remove();
                    adsRemoved++;
                } else {
                    tweet.remove();
                    adsRemoved++;
                }
            }
        });
        
        // Remove full-page overlay ads (brnd/schulist.link and similar)
        const overlayAds = document.querySelectorAll(
            'div[id*="brnd"], ' +
            'iframe[id*="ibrnd"], ' +
            'iframe[src*="schulist.link"], ' +
            'iframe[name*="nibrnd"], ' +
            'div[style*="position: fixed"][style*="z-index"], ' +
            'div[id^="b"], ' +
            'a[href*="bashirian.biz"], ' +
            'img[src*="schulist.link"]'
        );
        overlayAds.forEach(ad => {
            // Check if it's an overlay ad
            if (ad.id && ad.id.includes('brnd') ||
                ad.src && ad.src.includes('schulist.link') ||
                ad.name && ad.name.includes('nibrnd') ||
                (ad.style.position === 'fixed' && ad.querySelector('iframe[src*="schulist"]')) ||
                ad.href && ad.href.includes('bashirian.biz') ||
                (ad.tagName === 'IMG' && ad.src.includes('schulist.link'))) {
                // Remove the ad or its parent container
                const parent = ad.closest('div[id]');
                if (parent && parent.querySelector('a[href*="bashirian.biz"]')) {
                    parent.remove();
                    adsRemoved++;
                } else {
                    ad.remove();
                    adsRemoved++;
                }
            }
        });
        
        // Remove bashirian.biz ad containers
        const bashirianAds = document.querySelectorAll('div[id], a[href*="bashirian.biz"]');
        bashirianAds.forEach(element => {
            const link = element.querySelector('a[href*="bashirian.biz"]');
            const img = element.querySelector('img[src*="schulist.link"]');
            const isBashirianLink = element.tagName === 'A' && element.href.includes('bashirian.biz');
            
            if (link || img || isBashirianLink) {
                // Remove parent container if exists, otherwise remove the element itself
                const parent = element.closest('div[id]');
                if (parent && parent !== element) {
                    parent.remove();
                    adsRemoved++;
                } else {
                    element.remove();
                    adsRemoved++;
                }
            }
        });
        
        // Remove srv224.com and trackadrequest.com ads
        const srv224Ads = document.querySelectorAll(
            'div[id*="eas-"], ' +
            'a[href*="srv224.com"], ' +
            'a[href*="trackadrequest.com"], ' +
            'img[id*="eas-"], ' +
            'img[src*="srv224.com"]'
        );
        srv224Ads.forEach(ad => {
            // Check if it's a srv224/trackadrequest ad
            if (ad.id && ad.id.includes('eas-') ||
                ad.href && (ad.href.includes('srv224.com') || ad.href.includes('trackadrequest.com')) ||
                ad.src && ad.src.includes('srv224.com')) {
                // Remove the ad or its parent container
                const parent = ad.closest('div[id*="eas-"]');
                if (parent) {
                    parent.remove();
                    adsRemoved++;
                } else {
                    ad.remove();
                    adsRemoved++;
                }
            }
        });
        
        if (adsRemoved > 0) {
            console.log(`Removed ${adsRemoved} ad(s)`);
        }
        
        return adsRemoved > 0;
    }
    
    // Block ad scripts from loading
    function blockAdScripts() {
        // Block Google ad scripts
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'SCRIPT') {
                        const src = node.src || '';
                        if (src.includes('googlesyndication') || 
                            src.includes('googletagservices') ||
                            src.includes('doubleclick') ||
                            src.includes('adsbygoogle')) {
                            console.log('Blocked ad script:', src);
                            node.remove();
                        }
                    }
                });
            });
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Start blocking ad scripts
        blockAdScripts();
        
        // Run immediately
        removeGoogleAds();
        
        // Monitor for ads appearing using MutationObserver
        const observer = new MutationObserver(function(mutations) {
            removeGoogleAds();
        });
        
        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also check periodically as a backup (every 1 second)
        setInterval(removeGoogleAds, 1000);
        
        console.log('Ad blocking active on', window.location.hostname);
    }
    
    // Add CSS to hide common ad elements
    const style = document.createElement('style');
    style.textContent = `
        iframe[id*="google_ads"],
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        iframe[src*="adx.ws"],
        iframe[src*="czilladx"],
        iframe[src*="schulist.link"],
        iframe[data-ad-banner],
        iframe.ad-banner,
        iframe[id*="ibrnd"],
        iframe[name*="nibrnd"],
        div[id*="brnd"],
        div[id*="eas-"],
        a[href*="bashirian.biz"],
        a[href*="srv224.com"],
        a[href*="trackadrequest.com"],
        img[src*="schulist.link"],
        img[src*="srv224.com"],
        img[id*="eas-"],
        div:has(> a[href*="bashirian.biz"]),
        div:has(> a[href*="srv224.com"]),
        div:has(> a[href*="trackadrequest.com"]),
        .adsbygoogle,
        [id*="google_ads"],
        .sdaContainer,
        div[aria-label="Advertisement"],
        #ads-container,
        div[data-creative*="sponsoredCreative"],
        .da-card-creative,
        div.da,
        div[class*="da--"],
        .unit_list_banner,
        .nts-ad,
        [class*="nts-ad"],
        .advtext,
        .sevioads,
        [id*="sevio"],
        [id*="wrapper-sevio"],
        div[id*="sevio_iframe"],
        .noindex-section[data-nosnippet],
        .ad-banner-container,
        section.ad-banner-container,
        ytd-ad-slot-renderer,
        ytd-in-feed-ad-layout-renderer,
        ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
        ad-slot-renderer,
        [class*="ad-slot"],
        [class*="AdSlot"],
        shreddit-comments-page-ad,
        shreddit-ad-post,
        [class*="promotedlink"],
        [slot="full-comments-page-ad-link"],
        [post-promoted],
        [data-testid="cellInnerDiv"]:has([data-testid="placementTracking"]) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
        }
    `;
    document.head.appendChild(style);
})();
