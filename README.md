# KnowHow4j: A Web-Based Editor and Visualiser for Distributed Linked-Data Instructions 

A Javascript Editor and Visualisation Client for Instructional Web Pages using [RDFa](https://rdfa.info/) and [PROHOW](https://w3id.org/prohow/). This client allows users to generate HTML+RDFa web documents that represent instructions (following the PROHOW data model) and it allows them to access these and other RDF resources and explore them in a graphical interface.

The resources in this repository are published under the [Creative Commons Attribution-NonCommercial 3.0 licence](https://creativecommons.org/licenses/by-nc/3.0/).

* [What it is and what it does](https://github.com/paolo7/khjsdevelop#what-it-is-and-what-it-does)
* [Tutorial](https://github.com/paolo7/khjsdevelop#tutorial)
* [Notes](https://github.com/paolo7/khjsdevelop#notes)

# What it is and what it does

## Client

The RDFa How-To Instructions Editor and Visualiser Client is a collection of two Javascript applications, the Editor and the Visualiser, which can be accessed through a Web-based HTML interface. To access this interface, after downloading this repository simply open the khjsclient.htm file with a Javascript enabled browser. 

### Supported Data Formats

At the moment the client can parse Turtle, RDF/XML and RDFa files. It cannot currently parse JSON-LD, SPARQL endpoints and LD-Fragments.

### Editor

The editor can be accessed by loading the khjsclient.htm file in a browser and clicking on the EDITOR button.

The editor allows to parse instructions in a semi-structured natural language text into an RDFa+HTML representation following the [PROHOW](https://w3id.org/prohow/) data model. See the tutorial below for an example on how to use it.

The editor is divided into two fields.

The first field is the title field, where you can enter the title of your set of instructions.

The second field is the description box, where you can enter information on how to accomplish these instructions.

In the output box, you can add the following information:
* A short textual description of the overall set of instructions
* A list of requirements. These have to be written one per line, and they need to start with the keyword 'Requirement:'
* A list of steps. These have to be written one per line, and they need to start with the keyword 'Step:'
* A list of methods. These have to be written one per line, and they need to start with the keyword 'Method:'
These keywords are not case sensitive, and optional numbers can be added, like 'Step 1:' and 'Step 2:'.

Links to other sets of instructions can be added into requirements, steps or methods within square brackets. Links can be made using the 'requirement', 'step' or 'method' relation. To create one such link, add the name of the relation, followed by a space and the URL of the resource to link within square brackets. For example, to say that url `http://example.com` is a method of one of the steps of the set of instructions, you could write: `[method http://example.com]` at the end of the step description.

The button 'Parse into RDF' under these fields allows you to visualise the HTML+RDFa representation of the set of instructions, and to immediately visualise it as HTML. This visualisation can help you to discover wether your textual input has been interpreted correctly.

### Visualiser

The visualisator can be accessed by loading the khjsclient.htm file in a browser and clicking on the VIEW button.

To use the visualiser, enter the URL of the page to parse into the search box and click on the 'Search' button. The list of retrieved instructions should soon appear under the button.

Clicking on one of these instructions opens up a graphical visualisation. In the graphical visualisation, you can click on the boxes to collapse or expand elements. You can also drag the visualisation around by clicking on the background.

IMPORTANT NOTE: When following links between different documents, an unnamed box labelled with three dots `...` will appear. Clicking on it once only retrieves the data from the new document. In order to visualise the new information, this box needs to be clicked AGAIN after the data has been loaded.

## Server

Although this client is supposed to be self-contained, some server functionalities might be needed to overcome certain internet limitations.

### PhP Proxy
The process of dynamically loading distributed data files might be blocked by the browser becayse of same origin policy. To prevent these restrictions [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) is used. Resources that do not implement CORS can still be retrieved through a PhP proxy. One possible implementation of this proxy is provided. It is a modified version of the [PhD Simple Proxy](http://benalman.com/projects/php-simple-proxy/).

NOTE: the configuration file config.js is initialised with the server-side scripts currently hosted on http://paolopareti.uk/ HOWEVER these scripts are only meant as examples and might become unavailable at any moment. To ensure that your copy of this program runs reliably it is strongly advised that you host those scripts on your own server and you update the config.js file accordingly. 

# Tutorial

The files used in this tutorial can be found under the [example](https://github.com/paolo7/khjsdevelop/tree/master/example) subfolder of this repository.

## Editor Tutorial

The editor can be accessed by loading the khjsclient.htm file in a browser and clicking on the EDITOR button.

### Create a set of instructions

Load the editor page and insert an instruction description as follows:

Insert the following description in the title box:
```
How to prepare a pancake mix in a bowl
```
Insert the following description in the text area:
```
These instructions will tell you how to prepare a pancake mix

Requires: Eggs
Requires: Milk
Requires: Flour
Requires: Bowl
Requires: Whisk

Step 1: Add the eggs in a large bowl
Step 2: Add the milk in the bowl
Step 3: Whisk the milk and the eggs in the bowl
Step 4: Add the flour in the bowl
Step 5: Whisk the mix in the bowl until it becomes sufficiently smooths
```

Click on the 'Parse into RDF' button at the bottom of the page.

An HTML visualisation of the instructions will appear under the form. Under this visualisation, the HTML+RDFa code for these instructions will be displayed.
Copy this code and paste it into an HTML file published on a server. In this example, the file will be uploaded to URL:  `http://paolopareti.uk/dataset/simple/pancake_mix.htm`.

<p align="center"><div style="text-align:center"><img src="https://github.com/paolo7/khjsdevelop/blob/master/example/editor.jpg" width="75%"></div></p>

### Create a set of instructions linked to another one

Load the editor page and insert an instruction description as follows:

Insert the following description in the title box:
```
How to prepare a pancake
```

Insert the following description in the text area:
```
These instructions will tell you how to make a delicious pancake.

Requires: Eggs
Requires: Milk
Requires: Flour


Step 1: Prepare the pancake mix [method http://paolopareti.uk/dataset/simple/pancake_mix.htm]
Step 2: Pour the mix in a hot pan
Step 3: Cook until golden

Method: Alternatively, make a pancake using pancake mix
```

Click on the 'Parse into RDF' button at the bottom of the page. As before, the HTML+RDFa code will be displayed, along with the visualisation of it. This code is now linking to the page we previously created. If you have published it on a different URL, adjust the above code accordingly. 

Copy this last code and paste it into an HTML file published on a server. In this example, the file will be uploaded to URL:  `http://paolopareti.uk/dataset/simple/pancake.htm`.


## Visualisation Tutorial

The visualisator can be accessed by loading the khjsclient.htm file in a browser and clicking on the VIEW button.

In the viewer search box, add the last page you have created. In this example it is  `http://paolopareti.uk/dataset/simple/pancake.htm`. Click on 'Search'. 

Click on the instruction 'How to prepare a pancake' that should have appeared. 

Click on 'Prepare the pancake mix' to expand it. A new box should appear on the left. Click on this box to retrieve the linked set of instructions. 

Once this box is selected, click on it AGAIN to expand it. The information retrieved from the second set of instruction should now be visualised in the same graphical representation.

<p align="center"><div style="text-align:center"><img src="https://github.com/paolo7/khjsdevelop/blob/master/example/viewer.jpg" width="100%"></div></p>

# Notes

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





