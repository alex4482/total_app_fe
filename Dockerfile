# === Build stage ===
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# dacă scriptul tău de build are alt nume, schimbă aici
RUN npm run build

# === Runtime (Nginx) ===
FROM nginx:alpine
# pentru SPA (react-router), folosește configul de mai jos:
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
