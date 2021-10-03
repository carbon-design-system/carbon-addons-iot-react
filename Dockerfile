FROM cypress/browsers:node14.17.0-chrome91-ff89

RUN mkdir /@ai-apps
WORKDIR /@ai-apps
COPY packages/react/ /@ai-apps/packages/react
COPY yarn.lock /@ai-apps
COPY package.json /@ai-apps

RUN yarn --frozen-lockfile
