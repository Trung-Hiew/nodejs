# Dockerfile for frontend (ReactJS)
FROM node:21

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install --only=production
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
