#!/bin/bash

for file in $(find deploy/params -type f -path *.params.json); do
    envName=$(echo $file | xargs basename | sed "s/.params.json//");
    config=$(cat deploy/config.json);
    params=$(cat $file);

    params=$(echo $params | jq ".Image=\"$REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION\"");
    params=$(echo $params | jq ".Version=\"$CODEBUILD_RESOLVED_SOURCE_VERSION\"");

    config=$(echo $config | jq --argjson params "$params" '.Parameters=$params');
    echo $config > ${envName}.config.json
done