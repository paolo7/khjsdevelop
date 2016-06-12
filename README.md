
Current PhP proxy implementation adapted from http://benalman.com/projects/php-simple-proxy/


Modified to allow non-https proxies:

  this.proxyIfNecessary = function (uri) {

    if (typeof tabulator !== 'undefined' && tabulator.isExtension) return uri // Extenstion does not need proxy
    // browser does 2014 on as https browser script not trusted
    // If the web app origin is https: then the mixed content rules
    // prevent it loading insecure http: stuff so we need proxy.
    if ($rdf.Fetcher.crossSiteProxyTemplate &&
        (typeof document !== 'undefined') &&
        document.location // &&
        // ('' + document.location).slice(0, 6) === 'https:' && // origin is secure
        // uri.slice(0, 5) === 'http:'
		) { // requested data is not
      return $rdf.Fetcher.crossSiteProxyTemplate.replace('{uri}', encodeURIComponent(uri))
    }
    return uri
  }