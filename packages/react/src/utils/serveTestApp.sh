#!/bin/bash
set -e

touch serve.log
npx serve -s ../../../test-app/build --debug &>serve.log &
NODE_PID=$!

while read line; do
  if [[ "$line" == *"Accepting connections"* ]]; then
    echo "Accepting connections. Killing node."
    kill $NODE_PID
    exit 0
  fi
done <serve.log

wait
