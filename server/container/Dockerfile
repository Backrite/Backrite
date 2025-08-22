FROM node:18-alpine

WORKDIR /usr/src/app

# Copy index.js only; code/tests are mounted
COPY index.js .

# Install postman-request
RUN npm init -y
RUN npm i postman-request express

CMD ["node", "index.js"]
