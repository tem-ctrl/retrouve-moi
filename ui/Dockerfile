# IMPORTANT: Node.js Version Maintenance
# To ensure security and compatibility, regularly update the NODE_VERSION ARG to the latest LTS version.
ARG NODE_VERSION=24.18.0-slim

FROM node:${NODE_VERSION} AS base
WORKDIR /app
COPY package.json yarn.lock* ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    corepack enable yarn && \
    yarn install --frozen-lockfile --production=false

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so
# they must be passed as a build-arg here rather than set at container
# runtime (a runtime env var/`.env` file has no effect on the built bundle).
ARG NEXT_PUBLIC_API_URL=https://api.retrouve-moi.com/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable yarn && \
    yarn build

FROM node:${NODE_VERSION} AS runner
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder --chown=node:node /app/public ./public
RUN mkdir .next
RUN chown node:node .next
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/.next/cache ./.next/cache
USER node
EXPOSE 3000
CMD ["/bin/sh", "-c", "node server.js"]
