FROM node:21-alpine AS build

ARG REACT_APP_STRIPE_PUBLISHABLE_KEY 
ARG REACT_APP_STRIPE_PRICE_ID 

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN REACT_APP_STRIPE_PUBLISHABLE_KEY =${REACT_APP_STRIPE_PUBLISHABLE_KEY } \ 
  REACT_APP_STRIPE_PRICE_ID=${REACT_APP_STRIPE_PRICE_ID} \ 
  npm run build 

FROM nginx:latest as prod

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]