FROM node:lts

COPY / /root
WORKDIR /root
CMD npm run start
