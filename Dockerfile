FROM cypress/browsers:node14.17.0-chrome91-ff89

RUN mkdir /carbon-addons-iot-react
WORKDIR /carbon-addons-iot-react
COPY packages/react/ .
COPY yarn.lock .

RUN yarn --frozen-lockfile
