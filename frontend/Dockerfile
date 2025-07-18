FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start", "--", "-p", "3000", "-H", "0.0.0.0"]
