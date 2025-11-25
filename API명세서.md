# API 명세서

## 1. 인증 (Authentication) (`/api/auth`)

### 로그인 (Login)
- **Endpoint:** `POST /api/auth/login`
- **설명:** 사용자를 인증하고 토큰을 반환합니다.
- **요청 본문 (Request Body):**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답 (Response):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUz...",
    "user": {
      "id": 1,
      "name": "홍길동",
      "email": "user@example.com"
    }
  }
  ```

### 회원가입 (Signup)
- **Endpoint:** `POST /api/auth/signup`
- **설명:** 새로운 사용자를 등록합니다.
- **요청 본문 (Request Body):**
  ```json
  {
    "name": "홍길동",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답 (Response):**
  ```json
  {
    "message": "회원가입이 완료되었습니다.",
    "user": {
      "id": 1,
      "name": "홍길동",
      "email": "user@example.com"
    }
  }
  ```

### 로그아웃 (Logout)
- **Endpoint:** `POST /api/auth/logout`
- **설명:** 현재 사용자를 로그아웃 처리합니다.
- **응답 (Response):**
  ```json
  {
    "message": "로그아웃 되었습니다."
  }
  ```

## 2. 매물 / 지도 (Market / Map) (`/api/market`)

### 매물 목록 조회 (Get Properties)
- **Endpoint:** `GET /api/market/properties`
- **설명:** 지도 범위와 필터 조건에 맞는 매물 목록을 조회합니다.
- **쿼리 파라미터 (Query Parameters):**
  - `minLat`, `maxLat`, `minLng`, `maxLng`: 지도 범위 (Bounds)
  - `type`: 매물 유형 (APT: 아파트, OPST: 오피스텔, VILLA: 빌라)
  - `minPrice`, `maxPrice`: 가격 범위
- **응답 (Response):**
  ```json
  [
    {
      "id": "gangnam-1",
      "name": "강남 아파트 1호",
      "type": "아파트",
      "price": "10억 5000만원",
      "deposit": "5억",
      "lat": 37.5172,
      "lng": 127.0473,
      "address": "서울시 강남구 역삼동 123-45",
      "area": "32평",
      "floor": "15층",
      "maintenanceFee": "20만원",
      "description": "역세권, 채광 좋음...",
      "safetyScore": 85
    }
  ]
  ```

### 매물 상세 조회 (Get Property Detail)
- **Endpoint:** `GET /api/market/properties/:id`
- **설명:** 특정 매물의 상세 정보를 조회합니다.
- **응답 (Response):**
  ```json
  {
    "id": "gangnam-1",
    "name": "강남 아파트 1호",
    "type": "아파트",
    "price": "10억 5000만원",
    // ... 목록 정보 포함
    "images": ["url1", "url2"],
    "agent": {
      "name": "안전 부동산",
      "contact": "010-1234-5678"
    }
  }
  ```

## 3. 사용자 / 마이페이지 (User / MyPage) (`/api/user`)

### 프로필 조회 (Get Profile)
- **Endpoint:** `GET /api/user/profile`
- **설명:** 현재 로그인한 사용자의 프로필 정보를 조회합니다.
- **응답 (Response):**
  ```json
  {
    "id": 1,
    "name": "홍길동",
    "email": "user@example.com",
    "phone": "010-1234-5678"
  }
  ```

### 프로필 수정 (Update Profile)
- **Endpoint:** `PUT /api/user/profile`
- **설명:** 사용자의 프로필 정보를 수정합니다.
- **요청 본문 (Request Body):**
  ```json
  {
    "name": "홍길동 (수정)",
    "phone": "010-9876-5432"
  }
  ```

### 내 집 목록 조회 (Get My Homes)
- **Endpoint:** `GET /api/user/homes`
- **설명:** 사용자가 등록한 '내 집' 목록을 조회합니다.
- **응답 (Response):**
  ```json
  [
    {
      "id": 1,
      "address": "서울시 강남구 역삼동 123-45",
      "nickname": "우리집"
    }
  ]
  ```
