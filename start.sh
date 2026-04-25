#!/bin/bash
cd /home/repos/devault
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public 2>/dev/null || true
set -a && source .env.local && set +a
HOST=0.0.0.0 PORT=3000 node .next/standalone/server.js
