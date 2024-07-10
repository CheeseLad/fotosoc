#!/bin/sh

# Generate the env-config.js file with environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  REACT_APP_STRIPE_PUBLISHABLE_KEY: "$REACT_APP_STRIPE_PUBLISHABLE_KEY",
  REACT_APP_STRIPE_PRICE_ID: "$REACT_APP_STRIPE_PRICE_ID"
};
EOF
