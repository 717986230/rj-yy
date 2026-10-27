FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/server/package.json apps/server/
RUN npm ci --workspace @vido/server --include-workspace-root=false
COPY packages/shared packages/shared
COPY apps/server apps/server
ENV NODE_ENV=production PORT=8787 DATABASE_FILE=/data/vido.db
VOLUME /data
EXPOSE 8787
CMD ["npm", "start", "-w", "@vido/server"]
