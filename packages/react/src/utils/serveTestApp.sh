#!/bin/bash

trap "exit" INT TERM ERR
trap "kill 0" EXIT

touch server.log
ls
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
