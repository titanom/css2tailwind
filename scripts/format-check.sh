#!/bin/bash

turbo format root:format:check

pushd examples/standalone
pnpm format:check
popd

pushd examples/monorepo
pnpm format:check
popd
