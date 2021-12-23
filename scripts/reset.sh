#!/bin/bash

pushd ../web/src

rm authConfig.js
cp 'authConfig placeholders.js' authConfig.js

popd