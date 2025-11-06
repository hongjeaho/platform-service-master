package com.platform.common.web;

import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
    "com.platform.common.base",
    "com.platform.datasource.base",
    "com.platform.common.web",
})
public class WebBaseTestApplication {

}
