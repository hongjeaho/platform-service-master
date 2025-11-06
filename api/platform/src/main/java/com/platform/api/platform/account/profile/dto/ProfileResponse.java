package com.platform.api.platform.account.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.jooq.generated.tables.pojos.UserEntity;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(name = "ProfileResponse", description = "사용자 프로필 정보 응답")
public class ProfileResponse extends UserEntity {

    @Schema(description = "권한 목록", example = "[\"ADMIN\", \"USER\"]")
    private List<String> roleNames;

    public ProfileResponse(UserEntity userEntity, List<String> roleNames) {
        super(userEntity);
        this.roleNames = roleNames;
    }
}