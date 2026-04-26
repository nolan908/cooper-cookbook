# pull official base image
FROM node:22
# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH
# install app dependencies
COPY package*.json ./
RUN npm ci
# add app
COPY . ./
# start Vite dev server and bind all interfaces for Docker port mapping
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
