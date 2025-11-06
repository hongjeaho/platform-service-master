package com.platform.api.platform.file.base.controller;

import com.platform.common.core.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "File base API", description = "파일 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file/base")
public class FileController {
    private final FileService fileService;

    @Operation(summary = "파일을 다운로드", description = "파일을 다운로드")
    @GetMapping("/download/{fileSeq}")
    ResponseEntity<Resource> fileDownload(@PathVariable("fileSeq") long fileSeq) throws IOException {
        var fileInfo = fileService.findFileBySeq(fileSeq);
        var filePath = Paths.get(fileInfo.getFilePath()).resolve(fileInfo.getChangedFileName());

        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        String encodedFileName = URLEncoder.encode(fileInfo.getOriginalFileName(), StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        String contentDisposition = "attachment;  filename*=UTF-8''" + encodedFileName;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(resource.contentLength())
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }
}