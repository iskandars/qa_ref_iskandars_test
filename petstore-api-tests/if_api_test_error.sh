#!/bin/bash
# Clear npm cache
npm cache clean --force

# Delete node_modules directory and package-lock.json
rm -rf node_modules
rm -f package-lock.json

# Reinstall all dependencies
npm install
