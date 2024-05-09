# Use an official Node runtime as base image
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Set env variable
ARG REACT_APP_BACKEND
ARG REACT_APP_KEYCLOAK_REALM
ARG REACT_APP_KEYCLOAK_URL
ARG REACT_APP_KEYCLOAK_CLIENTID
ARG REACT_APP_SSO_REDIRECT_URI
ARG REACT_APP_SITEMINDER_LOGOUT

ENV REACT_APP_BACKEND=$REACT_APP_BACKEND
ENV REACT_APP_KEYCLOAK_REALM=$REACT_APP_KEYCLOAK_REALM
ENV REACT_APP_KEYCLOAK_URL=$REACT_APP_KEYCLOAK_URL
ENV REACT_APP_KEYCLOAK_CLIENTID=$REACT_APP_KEYCLOAK_CLIENTID
ENV REACT_APP_SSO_REDIRECT_URI=$REACT_APP_SSO_REDIRECT_URI
ENV REACT_APP_SITEMINDER_LOGOUT=$REACT_APP_SITEMINDER_LOGOUT

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Use an official Nginx image as base image
FROM nginx:alpine

# COPY nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app from the previous stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port the Nginx server will use
EXPOSE 80

# The default command for the Nginx image starts the server, so no need to specify CMD
