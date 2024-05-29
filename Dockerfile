# Sử dụng image node phiên bản LTS
FROM node:19.9.0  as builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

COPY scripts scripts
COPY public public

ENV NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=8192"
# Cài đặt các dependencies
RUN npm install

# Sao chép các file trong thư mục nguồn vào thư mục làm việc
COPY . .

# Xây dựng ứng dụng React
RUN npm run build

# Sử dụng một image web server nhẹ để chạy ứng dụng đã xây dựng
FROM nginx:alpine

# Sao chép các file cần thiết từ image node đã xây dựng
COPY --from=builder /app/build /usr/share/nginx/html

# Sao chép tệp cấu hình Nginx
COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf


# Thiết lập cổng mặc định của Nginx
EXPOSE 80

# Khởi động Nginx khi container được chạy
CMD ["nginx", "-g", "daemon off;"]