FROM node:20-slim

# Install TeX Live with the packages your templates need
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./

# Skip Puppeteer's Chromium download — it's an unused dependency in this project
ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN npm ci --omit=dev
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
