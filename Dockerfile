FROM node:10.15.1-alpine

EXPOSE 3000
ENV HOME=/home/app
WORKDIR $HOME

# This assumes that the application has been built first
COPY node_modules/  node_modules/
COPY package.json  .
COPY configuration/ configuration/
COPY data/ data/
COPY dist/ dist/

CMD ["npm", "run", "run:server:prod"]
