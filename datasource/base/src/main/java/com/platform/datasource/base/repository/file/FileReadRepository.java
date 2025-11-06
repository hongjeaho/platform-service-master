package com.platform.datasource.base.repository.file;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JFile;
import org.jooq.generated.tables.pojos.FileEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class FileReadRepository {

    private final DSLContext dslContext;
    private final JFile FILE = JFile.FILE;

    /**
     * 파일 정보 조회
     *
     * @param fileSeq 파일릴련번호
     * @return 파일 정보
     */
    public FileEntity findFileByFileSeq(long fileSeq) {
        return dslContext.select(FILE.fields())
            .from(FILE)
                .where(FILE.SEQ.eq(fileSeq))
                .fetchOneInto(FileEntity.class);
    }
}
