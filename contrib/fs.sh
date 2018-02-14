#!/bin/sh
set -xe
cat > "files/$MEMRY_UPLOAD_ID.bin.part"
mv "files/$MEMRY_UPLOAD_ID.bin.part" "files/$MEMRY_UPLOAD_ID.bin"
