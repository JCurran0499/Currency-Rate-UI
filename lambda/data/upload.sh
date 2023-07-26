#!/bin/bash

zip -r index.zip index.js package.json node_modules
aws lambda update-function-code --function-name Exchange-Rates-Updater --zip-file fileb://index.zip --output text