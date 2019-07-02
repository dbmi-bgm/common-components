#!/usr/bin/env node


/**
 * Given a path to parent application, this will setup symlinks
 * up to it for all peerDependencies in package.json.
 * @module
 */

const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const [ , , ...args ] = process.argv;
const [ parentApplicationRootDirUnParsed ] = args;

let parentApplicationRootDir = path.resolve(parentApplicationRootDirUnParsed);

if (!parentApplicationRootDir) {
    throw new Error("Invalid Parent application root directory supplied (first argument).");
}

let splitPathToParentApp = parentApplicationRootDir.split(path.sep);
if (splitPathToParentApp[splitPathToParentApp.length - 1] === "node_modules"){
    splitPathToParentApp = splitPathToParentApp.slice(0, -1);
    parentApplicationRootDir = splitPathToParentApp.join(path.sep);
}

// Read package.json to grab peerDependencies

const pkgDataRaw = fs.readFileSync("./package.json");
if (!pkgDataRaw){
    throw new Error("Couldn't get package.json data");
}

const pkgData = JSON.parse(pkgDataRaw);
const { peerDependencies = {} } = pkgData;
const peerDependencyNames = Object.keys(peerDependencies);
const peerDependencyNamesLen = peerDependencyNames.length;

if (peerDependencyNamesLen === 0){
    throw new Error("No peer dependencies to link. Exiting.");
}

// Make sure we're linking to a valid project by checking target package.json
const parentPkgDataRaw = fs.readFileSync(path.resolve(parentApplicationRootDir, "package.json"));
const parentPkgData = JSON.parse(parentPkgDataRaw);
const { dependencies: parentPkgDependencies, name = "Unknown Project" } = parentPkgData;

// Ensure there's defined dependency for what we linking to.

// Check 1.
var i, currDependencyToCheck;
for (i = 0; i < peerDependencyNamesLen; i++){
    currDependencyToCheck = peerDependencyNames[i];
    if (typeof parentPkgDependencies[currDependencyToCheck] === 'undefined'){
        throw new Error("Peer dependency " + currDependencyToCheck + " is not listed in parent app dependencies.");
    }
}

// Check 2.
for (i = 0; i < peerDependencyNamesLen; i++){
    currDependencyToCheck = peerDependencyNames[i];
    if (!fs.existsSync(path.resolve(parentApplicationRootDir, 'node_modules', currDependencyToCheck))){
        throw new Error("Peer dependency " + currDependencyToCheck + " is not installed in parent app node_modules folder.");
    }
}


console.log(
    'Will npm-link the following peer dependencies to ' + parentApplicationRootDir + "('" + name + "'):\n",
    peerDependencyNames
);

// Remove existing project-local links or folders --

/** Taken from https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty#answer-32197381 */
function deleteFolderRecursive(pathToDelete) {
    if (pathToDelete.indexOf('/node_modules/') === -1){
        throw new Error("Error - expected to delete from node_modules");
    }
    if (fs.existsSync(pathToDelete)) {
        fs.readdirSync(pathToDelete).forEach(function(file, index){
            const curPath = path.resolve(pathToDelete, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(pathToDelete);
    }
}

let awaitLinkingCalled = 0;
function awaitLinking(){
    awaitLinkingCalled++;
    if (awaitLinkingCalled !== peerDependencyNamesLen){
        // Wait until all linked.
        return;
    }
    console.log("Linking complete, running `npm install`");
    childProcess.execSync("npm install");
    console.log("Success.");
}

peerDependencyNames.forEach(function(currDependencyName, idx){
    const localDependencyPath = path.resolve('./node_modules', currDependencyName);
    let isLink;
    try {
        const stats = fs.lstatSync(localDependencyPath);
        isLink = stats.isSymbolicLink();
    } catch (e){
        // No local node_modules dir for this dependency exists at all, this is fine.
        isLink = null;
    }
    if (isLink === true){
        console.log(localDependencyPath + " is already linked, will overwrite/update link.");
    } else if (isLink === false) {
        console.log(localDependencyPath + " exists but is not a link, will delete.");
        deleteFolderRecursive(localDependencyPath);
    }

    const targetDependencyPath = path.resolve(parentApplicationRootDir, 'node_modules', currDependencyName);

    // Perform npm link - async
    childProcess.exec('npm link "' + targetDependencyPath + '"', function(err, stdout, stderr){
        if (err){
            console.error(err);
        } else {
            console.log("Linked", targetDependencyPath);
            awaitLinking();
        }
    });
});
