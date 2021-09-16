FROM cypress/browsers:node14.17.0-chrome91-ff89

RUN echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
RUN mkdir /carbon-addons-iot-react
WORKDIR /carbon-addons-iot-react
COPY packages/react/ .
COPY yarn.lock .

RUN yarn --frozen-lockfile
