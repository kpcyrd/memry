#!/bin/sh
set -xe
cat > "files/$1.bin.part"
mv "files/$1.bin.part" "files/$1.bin"
