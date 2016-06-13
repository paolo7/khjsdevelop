## Client

### Supported Data Formats

At the moment the client can read Turtle, RDF/XML and RDFa files.

Missing data formats: JSON-LD, SPARQL endpoints, LD-Fragments.

## Server

A number of optional server functionalities are included.

NOTE: the configuration file config.js is initialised with the server-side scripts currently hosted on http://paolopareti.uk/ HOWEVER these scripts are only meant as examples and might become unavailable at any moment. To ensure that your copy of this program runs reliably it is strongly advised that you host those scripts on your own server and you update the config.js file accordingly. 

### PhP Proxy
The process of dynamically loading distributed data files might be blocked by the browser becayse of same origin policy. To prevent these restrictions [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) is used. Resources that do not implement CORS can still be retrieved through a PhP proxy. One possible implementation of this proxy is provided. It is a modified version of the [PhD Simple Proxy](http://benalman.com/projects/php-simple-proxy/).

### RDF Posting
...

## Note on rdflib.js

The rdflib.js library used has been modified. The main modifications are as follows:

* Modified to allow non-https proxies:
```
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
```
