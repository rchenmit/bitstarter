#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://warm-earth-7638.herokuapp.com";

var type = Function.prototype.call.bind( Object.prototype.toString );

var assertURLexists = function(url) {
    restler.get(url).on('complete', function(result) {
	if (result instanceof Error) {
	    console.log('Error: ' + result.message);
	    process.exit(1);
	} else {
	    var urlstr = url.toString();
	    return urlstr;
//	    console.log(result);
	}
    });
};

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioURL = function(urlstr, checksfile) {
//    console.log(urlstr);
//    process.exit(1);
    var urlcontents = restler.get(urlstr).on('complete', function(result) {
	if (result instanceof Error) {
	    console.log("%s cannot be found: %s", urlstr, result.message);
	    process.exit(1);
	} else {
	    $ = cheerio.load(result);
	    var checks = loadChecks(checksfile).sort();
	    var out = {};
	    for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	    }
	    var outJson = JSON.stringify(out, null, 4);
	    console.log(outJson);
	}
    });
//  process.exit(1);
//  return urlcontents;

}


var createURLoutfile = function(urlstr) {
    console.log("fdsafdsaf");
//    var outfilename = 'urlcontents.out'
    var urlcontents = restler.get(urlstr).on('complete', function(result) {
	if (result instanceof Error) {
	    console.log('Error: ' + result.message);
	    process.exit(1);
	} else {
	    console.log("fdsfdasfdaffdsafdsafdsfds");
//	    fs.writeFileSync('urlcontents.out', result);
//	    return cheerio.load(result);
	    console.log(cheerio.load(result));
//	    process.exit(1);
	}
    });
    console.log("right outside the restler call");
    console.log(urlcontents);
   return urlcontents;
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

/*var checkUrlFile = function(urlstr, checksfile) {
    cheerioURL(urlstr);

    $ = cheerioURL(urlstr)
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
}*/

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {

    program
        .option('-f, --file [html_file]', 'Path to index.html')
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url [url_address]', 'Path to url')
        .parse(process.argv);

//    assertUrlExists(program.url);

    if (program.url != null) {
//	console.log("program.url was inputted");
//	var URLoutfile = createURLoutfile(program.url);
//	var checkJson = checkHtmlFile(URLoutfile, program.checks);
//	var checkJson = checkUrlFile(program.url, program.checks);
	var checkJson = cheerioURL(program.url, program.checks);
    } else if (program.file !=null) {
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    } else {
	console.log("no input file..exiting");
	process.exit(1);
    }

//    var checkJson = checkHtmlFile(program.file, program.checks);
//    var outJson = JSON.stringify(checkJson, null, 4);
//    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
