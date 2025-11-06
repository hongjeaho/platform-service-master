package com.platform.datasource.base.mapper.user;

import org.apache.ibatis.annotations.Mapper;
import org.jooq.generated.tables.pojos.UserEntity;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserMapper {
    UserEntity findUserById(String id);
}