#!/bin/bash

# Create declarations directory if it doesn't exist
mkdir -p src/declarations/PivotFlow_frontend
mkdir -p src/declarations/PivotFlow_backend

# Copy Candid files if they don't exist
cp -n src/declarations/PivotFlow_frontend/PivotFlow_frontend.did ../.dfx/local/canisters/PivotFlow_frontend/PivotFlow_frontend.did 2>/dev/null || true
cp -n src/declarations/PivotFlow_frontend/PivotFlow_frontend.did ../.dfx/local/canisters/PivotFlow_frontend/assetstorage.did 2>/dev/null || true
