// ==UserScript==
// @name         Universal Ad Blocker (Google & LinkedIn)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Removes Google, LinkedIn, banner, and Sevio ads from all websites
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
            'div[class*="da--"]'
        );
        linkedinAds.forEach(ad => {
            // Double-check it's a LinkedIn ad
            if (ad.querySelector('.al__label') || 
                ad.querySelector('[class*="da-card"]') ||
                ad.innerHTML.includes('sponsoredCreative')) {
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
        .noindex-section[data-nosnippet] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
        }
    `;
    document.head.appendChild(style);
})();
