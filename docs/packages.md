# Blobindexreact - Packages <!-- omit in toc -->

## Contents <!-- omit in toc -->
- [NPM](#npm)
- [Dependabot](#dependabot)

## NPM
BlobIndexReact uses NPM for external dependencies. Both the web project as well as the function project have their own list of packages, stored in package.json at the root. In each of the projects you can run ```npm install``` to install packages. This command installs packages, checks for updates and reports vulnerabilities. 

When vulnerabilities are found, you can run ```npm audit fix``` and have npm try to fix the vulnerabilities by changing references to more recent versions of packages. Sometimes this works, sometimes it doesn't. When it doesn't the most common cause is that npm would have to change to a version with a potentially breaking change. You can then try ```npm audit fix --force```. 

You can also go over the packages.json entries and do updates there. For instance the top web dependency is "@azure/arm-authorization" which you can search for on https://www.npmjs.com and learn more about versions, features, dependencies, etc. 

## Dependabot
It is great that npm reports vulnerabilities. However when you are not building your solution regularly because you are not developing it and don't have active daily builds, GitHub will still notify you of new vulnerabilities through dependabot: an automated proces that checks your package versions regularly. Once you receive a dependabot email or see active issues in your repositories, you should update your code to make sure it stays fresh and trustworthy. 

This is also where codespaces help: open an old repo in a container in the cloud, browse to the package.json, run npm install, see the vulnerabilities and fix them, without pulling the entire repo and installing lots of packages on your workstation. 