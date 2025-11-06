package com.platform.common.web.controller;

import com.platform.common.web.annotation.ApplyMasking;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TesstMaskingController {

    @GetMapping
    public TestMaskingResponse testMasking() {
        return new TestMaskingResponse("어드민", "01012341234", "admin@gmail.com");
    }

    @GetMapping("/masking")
    @ApplyMasking
    public TestMaskingResponse testMaskingEx() {
        return new TestMaskingResponse("어드민", "01012341234", "admin@gmail.com");
    }

    @GetMapping("/masking/list")
    @ApplyMasking
    public List<TestMaskingResponse> testMaskingList() {
        return List.of(
                new TestMaskingResponse("어드민", "01012341234", "admin@gmail.com"),
                new TestMaskingResponse("시행자", "01012341234", "bdmin@gmail.com")
        );
    }
}
