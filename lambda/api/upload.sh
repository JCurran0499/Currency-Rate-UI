#!/bin/bash

zip -r lambda_function.zip lambda_function.py
aws lambda update-function-code --function-name Exchange-API-Response --zip-file fileb://lambda_function.zip --output text
