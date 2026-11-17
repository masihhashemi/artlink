#!/bin/zsh
set -e
open "/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app"
sleep 2
UDID=$(xcrun simctl list devices available | grep -m1 "iPhone 17 (" | sed -E 's/.*\(([A-F0-9-]+)\).*/\1/')
if [ -z "$UDID" ]; then
  UDID="24A87101-4DFB-47A2-B34B-3799D39D17E3"
fi
xcrun simctl boot "$UDID" 2>/dev/null || true
cd "$(dirname "$0")"
npm run ios
