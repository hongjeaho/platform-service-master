package com.platform.datasource.base.dto.opinioin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.OpinionCaseCommentEntity;

@NoArgsConstructor
@Getter
@Setter
@Builder
@Schema(name = "OpinionTemplateOpinionCommit", description = "의견 정보")
public class OpinionCaseTemplateCommit {

  public OpinionCaseTemplateCommit(OpinionCaseTemplate opinionCaseTemplate, List<OpinionCaseCommentEntity> opinionCaseCommentList) {
    this.opinionCaseTemplate = opinionCaseTemplate;
    this.opinionCaseCommentList = opinionCaseCommentList;
  }

  @NotNull
  @Schema(name = "opinionCaseTemplate", description = "템플릿 정보")
  private OpinionCaseTemplate opinionCaseTemplate;
  @Schema(name = "opinionCaseCommentList", description = "사업시행자 의견 리스트")
  private List<OpinionCaseCommentEntity> opinionCaseCommentList;


  /**
   * 의견 정보가 없는 경우
   *
   * @return 의견 없음
   */
  public static OpinionCaseTemplateCommit ofNoImplementerTemplateOpinion(long judgSeq) {
    return OpinionCaseTemplateCommit.builder()
        .opinionCaseTemplate(OpinionCaseTemplate.ofNoTemplateInfo(judgSeq))
        .build();
  }
}
