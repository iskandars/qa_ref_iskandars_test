#!/bin/bash
# If you don't have Cypress installed globally
# npm install -g cypress

# Create a new project directory (if you don't have one)
mkdir cypress-automation-demo
cd cypress-automation-demo

# Initialize a new npm project
npm init -y
# Install Cypress
npm install cypress --save-dev

# Install mochawesome and mochawesome-merge for reports
npm install mochawesome mochawesome-merge --save-dev

npm install --save-dev cypress-file-upload