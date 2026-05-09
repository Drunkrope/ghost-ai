#!/usr/bin/env bash

# Fetches all available BAPI spec versions, determines the latest,
# and extracts tags from it. Output is used as skill context.

set -euo pipefail

API_URL="https://api.github.com/repos/clerk/openapi-specs/contents/bapi"
RAW_BASE="https://raw.githubusercontent.com/clerk/openapi-specs/main/bapi"

# Fetch version list, parse dates, sort, pick latest
if ! versions=$(
  curl -sf "$API_URL" | node -e "
    let d='';
    process.stdin.on('data',c=>d+=c);
    process.stdin.on('end',()=>{
      const items = JSON.parse(d)
        .map(i=>i.name)
        .filter(n=>/^\d{4}-\d{2}-\d{2}\.yml$/.test(n))
        .sort();
      items.forEach(n=>console.log(n));
    });
  "
); then
  echo "Error: failed to fetch or parse versions from $API_URL" >&2
  exit 1
fi

if [ -z "$versions" ]; then
  echo "Error: no spec versions found at $API_URL" >&2
  exit 1
fi

latest=$(printf '%s\n' "$versions" | tail -1)

if [ -z "$latest" ]; then
  echo "Error: could not determine latest spec version from $API_URL" >&2
  exit 1
fi

echo "AVAILABLE VERSIONS: $(echo "$versions" | tr '\n' ' ')"
echo "LATEST VERSION: $latest"
echo ""
echo "TAGS:"
curl -s "${RAW_BASE}/${latest}" | node "$(dirname "$0")/extract-tags.js"
