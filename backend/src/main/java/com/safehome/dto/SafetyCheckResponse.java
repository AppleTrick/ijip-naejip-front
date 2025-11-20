package com.safehome.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class SafetyCheckResponse {
    private String safetyGrade; // SAFE, WARNING, DANGER
    private String message;
    private double debtRatio; // (Debt + Deposit) / MarketValue * 100
}
