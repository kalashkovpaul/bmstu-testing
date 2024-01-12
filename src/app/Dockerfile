FROM node:16.15.1-slim
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 5432
RUN node --version
CMD npm run test
