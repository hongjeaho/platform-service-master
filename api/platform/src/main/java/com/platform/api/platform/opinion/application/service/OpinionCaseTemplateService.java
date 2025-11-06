package com.platform.api.platform.opinion.application.service;


import com.platform.common.base.type.FileTypeCode;
import com.platform.common.core.service.FileService;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.opinioin.OpinionCaseTemplate;
import com.platform.datasource.base.repository.opinion.OpinionCaseReadRepository;
import com.platform.datasource.base.repository.opinion.OpinionCaseRepository;
import com.platform.datasource.base.repository.receipt.ReceiptSearchRepository;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.OpinionCaseCommentEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
public class OpinionCaseTemplateService {

  private final ReceiptSearchRepository ReceiptSearchRepository;
  private final OpinionCaseRepository opinionCaseRepository;
  private final OpinionCaseReadRepository opinionCaseReadRepository;
  private final FileService fileService;


  /**
   * 사업시행자 의견 템플릿을 등록하거나 업데이트한다.
   *
   * @param file                   첨부파일
   * @param opinionCaseTemplate    사업시행자 의견 템플릿 정보
   * @param opinionCaseCommentList 사업시행자 의견 코멘트 리스트
   * @throws IOException 파일 처리 중 발생할 수 있는 예외
   */
  public void insertOpinionCaseTemplate(MultipartFile file, OpinionCaseTemplate opinionCaseTemplate, List<OpinionCaseCommentEntity> opinionCaseCommentList) throws IOException {

    var judgSeq = opinionCaseTemplate.getJudgSeq();

    // 사업시행자 의견 일련번호가 없다면 템플릿 등록
    if (opinionCaseTemplate.getSeq() == null) {
      var opinionCaseTemplateSeq = opinionCaseRepository.insertInsertOpinionCase(opinionCaseTemplate);
      opinionCaseTemplate.setSeq(opinionCaseTemplateSeq);
    }

    // 첨부 파일 처리
    var fileSeq = opinionCaseTemplate.getAttachment().getFileSeq();
    if (file != null && fileSeq == null) {  // 신규
      createImplementerTemplateFile(opinionCaseTemplate, file);
    } else if (file != null) { // 파일 수정
      fileService.change(opinionCaseTemplate.getOpinionFileSeq(), file);
    } else if (fileSeq == null) {
      deleteImplementerTemplateFile(opinionCaseTemplate);
    }

    // 사업 시행자 의견 등록
    opinionCaseRepository.deleteOpinionTemplateCommentByOpinionCaseTemplateSeq(judgSeq, opinionCaseTemplate.getSeq());
    opinionCaseRepository.insertOpinionCaseComment(opinionCaseTemplate.getSeq(), opinionCaseCommentList);
  }

  /**
   * 사업시행자 의견 삭제
   *
   * @param judgSeq                재결일련번호
   * @param opinionCaseTemplateSeq 의견마스터 일련번호
   */
  public void deleteOpinionCaseTemplate(long judgSeq, long opinionCaseTemplateSeq) {

    var implementerTemplate = opinionCaseReadRepository.findImplementerTemplateByOpinionCaseTemplateSeq(judgSeq, opinionCaseTemplateSeq);

    opinionCaseRepository.deleteOpinionTemplateCommentByOpinionCaseTemplateSeq(judgSeq, opinionCaseTemplateSeq);
    opinionCaseRepository.deleteOpinionTemplateByOpinionCaseTemplateSeq(judgSeq, opinionCaseTemplateSeq);

    if (implementerTemplate.getOpinionFileSeq() != null) {
      fileService.delete(implementerTemplate.getOpinionFileSeq());
    }
  }

  /**
   * 사업시행자 의견 첨부 파일을 삭제한다.
   *
   * @param opinionCaseTemplate 템플릿 정보
   */
  private void deleteImplementerTemplateFile(OpinionCaseTemplate opinionCaseTemplate) {
    var resultImplementerTemplate = opinionCaseReadRepository.findImplementerTemplateByOpinionCaseTemplateSeq(opinionCaseTemplate.getJudgSeq(), opinionCaseTemplate.getSeq());
    if (resultImplementerTemplate.getOpinionFileSeq() != null) {
      opinionCaseRepository.updateOpinionCaseTemplateFileSeq(opinionCaseTemplate.getSeq(), null);
      fileService.delete(resultImplementerTemplate.getOpinionFileSeq());
    }
  }

  /**
   * 사업시행자 의견 첨부 파일을 등록한다.
   *
   * @param opinionCaseTemplate 템플릿 정보
   * @param file                첨부파일
   * @throws IOException IOException
   */
  private void createImplementerTemplateFile(OpinionCaseTemplate opinionCaseTemplate, MultipartFile file) throws IOException {
    var judgSeq = opinionCaseTemplate.getJudgSeq();
    var ltisResult = ReceiptSearchRepository.findInfoByJudgSeq(judgSeq);
    var fileSeq = fileService.upload(ltisResult.getCaseNo(), FileTypeCode.OPINION_FILE_UPLOAD, file);

    opinionCaseRepository.updateOpinionCaseTemplateFileSeq(opinionCaseTemplate.getSeq(), fileSeq);
  }

  /**
   * 사업시행의 의견 없음 처리
   *
   * @param judgSeq 재결일련번호
   */
  public void createImplementerNoTemplate(long judgSeq) {
    var implementerTemplateOpinionList = opinionCaseReadRepository.findImplementerTemplateByJudgSeq(judgSeq);

    // 등로된 의견이 없다면 9999 의견 없음을 설정한다.
    if (implementerTemplateOpinionList.isEmpty()) {
      var opinionCaseTemplate = OpinionCaseTemplate.ofNoTemplateInfo(judgSeq);
      opinionCaseRepository.insertInsertOpinionCase(opinionCaseTemplate);
    }
  }
}