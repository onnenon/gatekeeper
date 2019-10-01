#!/bin/bash

decrypt() {
    toDecrypt=$(mktemp)
    echo $1 | base64 -d > $toDecrypt
    echo $(aws kms decrypt --ciphertext-blob fileb://$toDecrypt --query Plaintext --output text | base64 -d)
    rm $toDecrypt
}

export SLACK_ACCESS_TOKEN=$(decrypt $ENCRYPTED_SLACK_ACCESS_TOKEN)
export SLACK_USER_TOKEN=$(decrypt $ENCRYPTED_SLACK_USER_TOKEN)
export SLACK_SIGNING_SECRET=$(decrypt $ENCRYPTED_SLACK_SIGNING_SECRET)
export PI_API_URL=$(decrypt $ENCRYPTED_PI_API_URL)

node src/index.js