FROM node:lts-alpine

ARG PORT
ENV PORT $PORT
ENV NODE_ENV production
EXPOSE $PORT

RUN mkdir -p /simulado
WORKDIR /simulado
ADD . /simulado
RUN npm install

CMD ["npm", "start"]  