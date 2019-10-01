FROM node:10
WORKDIR /app

ENV PORT 80
EXPOSE 80

COPY . .
RUN \
apt-get update && \
apt-get install -y python3 python3-pip && \
pip3 install awscli && \
chmod +x entrypoint.sh && \
npm install

ENTRYPOINT /app/entrypoint.sh