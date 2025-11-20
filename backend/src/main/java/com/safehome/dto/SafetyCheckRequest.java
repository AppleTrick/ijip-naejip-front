package com.safehome.dto;

import lombok.Data;

@Data
public class SafetyCheckRequest {
    private String address;
    private Long deposit; // 보증금
    private Long marketValue; // 시세
    private Long priorDebt; // 선순위 채권 (근저당 등)
}
