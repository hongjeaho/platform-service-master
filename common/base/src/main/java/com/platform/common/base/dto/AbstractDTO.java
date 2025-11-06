package com.platform.common.base.dto;

import com.google.gson.Gson;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
public class AbstractDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private Long createdBy;
    private LocalDateTime createdTime;
    private Long updatedBy;
    private LocalDateTime updatedTime;

    public <T> T copy(final Class<T> targetType) {
        return copy(this, targetType);
    }

    public static <T> T copy(final AbstractDTO source, final Class<T> targetType) {
        final var gson = new Gson();
        return gson.fromJson(gson.toJson(source), targetType);
    }
}
