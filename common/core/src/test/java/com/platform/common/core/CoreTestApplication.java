package com.platform.common.core;


import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
    "com.platform.common.base",
    "com.platform.datasource.base",
    "com.platform.common.core",
})
public class CoreTestApplication {

}
