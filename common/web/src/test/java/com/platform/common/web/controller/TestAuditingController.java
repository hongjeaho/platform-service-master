package com.platform.common.web.controller;

import com.platform.common.web.annotation.Auditing;
import com.platform.common.web.dto.UserTestComplexDTO;
import com.platform.common.web.dto.UserTestDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auditing-test")
public class TestAuditingController {

    @PostMapping("/user-dto")
    public UserTestDTO getUserDto(@Auditing UserTestDTO userTestDTO) {
        return userTestDTO;
    }

    @PostMapping("/user-list-dto")
    public List<UserTestDTO> getComplextEntities(@Auditing List<UserTestDTO> sampleDtos) {
        return sampleDtos;
    }

    @PostMapping("/user-sub-dto")
    public UserTestComplexDTO getComplexDto(@Auditing UserTestComplexDTO userTestDTO) {
        return userTestDTO;
    }
}
