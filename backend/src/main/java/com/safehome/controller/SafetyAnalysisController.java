package com.safehome.controller;

import com.safehome.dto.SafetyCheckRequest;
import com.safehome.dto.SafetyCheckResponse;
import com.safehome.service.SafetyAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow all for dev
public class SafetyAnalysisController {

    private final SafetyAnalysisService service;

    @PostMapping("/safety-check")
    public SafetyCheckResponse checkSafety(@RequestBody SafetyCheckRequest request) {
        return service.analyze(request);
    }
}
