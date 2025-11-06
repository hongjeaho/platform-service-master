package com.platform.common.web.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.platform.common.base.dto.AbstractDTO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class UserTestComplexDTO extends AbstractDTO {
    private String username;
    private String email;

    UserTestDTO subUser;
}
