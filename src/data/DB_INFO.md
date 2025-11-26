# Database Schema Information

## `dongcodes` (법정동코드)
| Field | Type | Comment |
|-------|------|---------|
| `dong_code` | VARCHAR(10) | 법정동코드 (PK) |
| `sido_name` | VARCHAR(30) | 시도이름 |
| `gugun_name` | VARCHAR(30) | 구군이름 |
| `dong_name` | VARCHAR(30) | 동이름 |

## `houseinfos` (주택정보)
| Field | Type | Comment |
|-------|------|---------|
| `apt_seq` | VARCHAR(20) | 아파트코드(식별자) (PK) |
| `sgg_cd` | VARCHAR(5) | 시군구코드 |
| `umd_cd` | VARCHAR(5) | 읍면동코드 |
| `jibun` | VARCHAR(10) | 지번 |
| `road_nm` | VARCHAR(20) | 도로명 |
| `road_nm_bonbun` | VARCHAR(10) | 도로명기초번호 |
| `road_nm_bubun` | VARCHAR(10) | 도로명추가번호 |
| `apt_nm` | VARCHAR(40) | 아파트이름 |
| `build_year` | INT | 준공년도 |
| `latitude` | VARCHAR(40) | 위도 |
| `longitude` | VARCHAR(40) | 경도 |
| `geo_status` | VARCHAR(10) | 지오코딩상태 (READY, DONE, FAIL) |

## `housedeals` (주택거래정보)
| Field | Type | Comment |
|-------|------|---------|
| `no` | INT | 거래번호 (PK, AI) |
| `apt_seq` | VARCHAR(20) | 아파트코드 (FK) |
| `apt_dong` | VARCHAR(40) | 아파트동 |
| `floor` | VARCHAR(3) | 아파트층 |
| `deal_date` | INT | 거래일자 (YYYYMMDD) |
| `exclu_use_ar` | DECIMAL(7,2) | 전용면적 |
| `deal_amount` | INT | 거래가격 (만원단위) |
