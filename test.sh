#!/bin/sh
set -xe
echo "ohai" | "$@" > r.json
echo "59a6f8a560dc8a7f99f470570bcc100f50e415922fbf71a27af34c5630cf233a  storage/`jq -r .id < r.json`.bin" | sha256sum -c
