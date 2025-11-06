package com.platform.common.core.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.platform.common.base.BaseSpringBootTest;
import com.platform.common.base.auth.AuthUser;
import com.platform.common.base.auth.BasicAuthority;
import com.platform.common.base.type.FileTypeCode;
import com.platform.common.core.service.helper.FileHelper;
import java.io.IOException;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@SpringBootTest
public class FileServiceTest extends BaseSpringBootTest {

  @Autowired
  private FileService fileService;

  @Autowired
  private FileHelper fileHelper;

  private static final String CASE_NO = "25수용0001";

  private static final AuthUser USER = AuthUser.builder()
      .seq(1L)
      .userId("ADMIN")
      .roles(Set.of(new BasicAuthority(1L, "DECISION")))
      .build();

  @BeforeEach
  public void setup() {
    UserDetails userDetails = USER;
    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

    SecurityContext context = mock(SecurityContext.class);
    when(context.getAuthentication()).thenReturn(authenticationToken);
    SecurityContextHolder.setContext(context);
  }

  @Test
  @DisplayName("파일 업로드 테스트")
  public void testUpload() throws IOException {
    String filePath = fileHelper.generatePath(CASE_NO, FileTypeCode.RECEIPT_FILE_UPLOAD);

    byte[] content = "dummy content".getBytes();
    MultipartFile file = new MockMultipartFile("file", "filename.txt", "text/plain", content);
    Long fileSeq = fileService.processFileUpload(filePath, file);

    assertTrue(true, "업로드 성공.");
    assertThat(fileSeq).isNotNull();
  }
}
