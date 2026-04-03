FROM node:20-slim
WORKDIR /app

# 패키지 정보 복사 및 의존성 설치
COPY package.json package-lock.json* ./
RUN npm install

# 나머지 소스코드 복사 및 프로젝트 빌드
COPY . .
RUN npm run build

# 3000 포트 노출
EXPOSE 3000

# 호스트를 0.0.0.0으로 열고 포트를 3000으로 고정하여 preview 실행
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]