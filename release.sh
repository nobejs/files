#!/bin/bash
eval yarn bump:pre

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo $PACKAGE_VERSION

cp="gh release create $PACKAGE_VERSION --notes \"$PACKAGE_VERSION\" -p"

echo $cp

# eval "$cp"%