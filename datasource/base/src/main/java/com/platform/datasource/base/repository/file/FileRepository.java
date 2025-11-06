package com.platform.datasource.base.repository.file;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JFile;
import org.jooq.generated.tables.pojos.FileEntity;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class FileRepository {

    private final DSLContext dslContext;
    private final JFile FILE = JFile.FILE;

    /**
     * file 정보를 저장하고 일련번호를 리턴한다.
     *
     * @param fileEntity 파일정보
     * @return 파일일련번호
     */
    public Long insertFileWithReturnSeq(FileEntity fileEntity) {
        return dslContext.insertInto(FILE,
                        FILE.FILE_PATH,
                        FILE.ORIGINAL_FILE_NAME,
                        FILE.CHANGED_FILE_NAME,
                        FILE.CREATED_BY,
                        FILE.CREATED_TIME)
                .values(
                        fileEntity.getFilePath(),
                        fileEntity.getOriginalFileName(),
                        fileEntity.getChangedFileName(),
                        UserAccountHolder.getSeqNo(),
                        LocalDateTime.now()
                ).returningResult(FILE.SEQ)
                .fetchOneInto(Long.class);
    }

    /**
     * 파일 삭제 처리
     *
     * @param fileSeq 파일일련번호
     */
    public void deleteBySeq(long fileSeq) {
        dslContext.deleteFrom(FILE).where(FILE.SEQ.eq(fileSeq)).execute();
    }

    /**
     * 파일 이름을 변경한다.
     *
     * @param fileEntity 파일 정보
     */
    public void updateFileName(FileEntity fileEntity) {
        dslContext.update(FILE)
                .set(FILE.ORIGINAL_FILE_NAME, fileEntity.getOriginalFileName())
                .set(FILE.CHANGED_FILE_NAME, fileEntity.getChangedFileName())
                .set(FILE.CREATED_BY, UserAccountHolder.getSeqNo())
                .set(FILE.CREATED_TIME, LocalDateTime.now())
                .where(FILE.SEQ.eq(fileEntity.getSeq()))
                .execute();
    }
}
