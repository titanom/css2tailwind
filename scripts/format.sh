#!/bin/bash

turbo format root:format

pushd examples/standalone
pnpm format
popd

pushd examples/monorepo
pnpm format
popd
