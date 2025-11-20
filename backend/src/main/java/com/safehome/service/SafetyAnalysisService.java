package com.safehome.service;

import com.safehome.dto.SafetyCheckRequest;
import com.safehome.dto.SafetyCheckResponse;
import org.springframework.stereotype.Service;

@Service
public class SafetyAnalysisService {

    public SafetyCheckResponse analyze(SafetyCheckRequest request) {
        long totalDebt = request.getDeposit() + request.getPriorDebt();
        double ratio = (double) totalDebt / request.getMarketValue() * 100;

        String grade;
        String message;

        if (ratio <= 60) {
            grade = "SAFE";
            message = "안전합니다. 깡통전세 위험이 낮습니다.";
        } else if (ratio <= 80) {
            grade = "WARNING";
            message = "주의가 필요합니다. 전세가율이 다소 높습니다.";
        } else {
            grade = "DANGER";
            message = "위험합니다! 보증금을 돌려받지 못할 위험이 큽니다.";
        }

        return new SafetyCheckResponse(grade, message, Math.round(ratio * 100.0) / 100.0);
    }
}
