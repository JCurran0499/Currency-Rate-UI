if ! [ -f s3_bucket.txt ]; then
    read -p "s3 bucket (cft templates): " bucket_name
    echo $bucket_name > s3_bucket.txt
fi

read -r S3_BUCKET < s3_bucket.txt

read -p "Update the web app? (Y/N): " UPDATE
if [ "$UPDATE" = "Y" ]; then
    cd app
    npm run build
    aws s3 sync build s3://currency-exchange-static-ui --delete
    cd ..
fi

sam build -t cloudformation.yaml
sam deploy -t cloudformation.yaml \
    --stack-name Exchange-Rates \
    --capabilities CAPABILITY_NAMED_IAM \
    --s3-bucket $S3_BUCKET