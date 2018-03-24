FROM node:carbon as builder

RUN npm install -g truffle

RUN cd / && \
    git clone https://github.com/zean00/idnet.git && \
    cd /idnet/smartid && \
    truffle compile

RUN cd /idnet/nodeid && \
    npm install

FROM node:carbon-alpine

RUN mkdir -p /idnet/nodeid/contracts
COPY --from=builder \
    /idnet/nodeid/ /nodeid/
COPY --from=builder \
    /idnet/smartid/build/contracts/ /nodeid/contracts/

EXPOSE 8080
WORKDIR /nodeid
CMD ["sh","/nodeid/start.sh"]
