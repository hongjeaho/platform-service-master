package com.platform.batch.platform.ltis.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.platform.batch.platform.common.utils.LocalDateFromDateTimeDeserializer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jooq.generated.tables.pojos.LtisTmpEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class LtisApiDto {

  @JsonProperty("judgSeq")
  @JsonAlias({"masterId"})
  private Long judgSeq;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate modDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate recepDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate lstReptOwnrModDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate lstRecmModDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate lstReptModDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate lstOwnrModDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate judgDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate implementerModDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate implementerDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate recmreqPrceDt;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate regDt;
  private String desnIns;
  private String charge;
  private String address;
  private String judgDivNm;
  private String judgDivCd;
  private String caseTitle;
  private String implementer;
  private Long bizOprtPrce;
  private String caseNo;
  private Long befCaseJudgSeq;
  private String statCd;
  private String useYn;
  private String statNm;
  private LocalDateTime createdTime;
  private LocalDateTime updatedTime;
  private String dessionCorp;
  private String corpNm;
  private String implementerBizNm;
  private String businessType;
  private Integer landCnt;
  private Integer landOwnrCnt;
  private Integer objectCnt;
  private Integer objectOwnrCnt;
  private String implementerNm;
  private String implementerTel;
  private String implementerId;
  private String implementerEmail;
  private String chargeNm;
  private String chargeId;
  private String chargeEmail;
  private Long frstCompAmtSum;
  private Long secdCompAmtSum;
  private String implementerPhone;


  public LtisTmpEntity totalDtoToTmpEntity() {
    return new LtisTmpEntity()
        .setModDt(this.modDt)
        .setRecepDt(this.recepDt)
        .setLstReptOwnrModDt(this.lstReptOwnrModDt)
        .setLstRecmModDt(this.lstRecmModDt)
        .setLstReptModDt(this.lstReptModDt)
        .setLstOwnrModDt(this.lstOwnrModDt)
        .setJudgDt(this.judgDt)
        .setImplementerModDt(this.implementerModDt)
        .setImplementerDt(this.implementerDt)
        .setRecmreqPrceDt(this.recmreqPrceDt)
        .setDesnIns(this.desnIns)
        .setCharge(this.charge)
        .setAddress(this.address)
        .setJudgDivNm(this.judgDivNm)
        .setJudgDivCd(this.judgDivCd)
        .setCaseTitle(this.caseTitle)
        .setImplementer(this.implementer)
        .setBizOprtPrce(this.bizOprtPrce)
        .setCaseNo(this.caseNo)
        .setBefCaseJudgSeq(this.befCaseJudgSeq)
        .setStatCd(this.statCd)
        .setUseYn(this.useYn)
        .setStatNm(this.statNm)
        .setJudgSeq(this.judgSeq)
        .setDessionCorp(this.dessionCorp)
        .setCorpNm(this.corpNm)
        .setImplementerBizNm(this.implementerBizNm)
        .setBusinessType(this.businessType)
        .setLandCnt(this.landCnt)
        .setLandOwnrCnt(this.landOwnrCnt)
        .setObjectCnt(this.objectCnt)
        .setObjectOwnrCnt(this.objectOwnrCnt)
        .setImplementerNm(this.implementerNm)
        .setImplementerTel(this.implementerTel)
        .setImplementerId(this.implementerId)
        .setImplementerEmail(this.implementerEmail)
        .setChargeNm(this.chargeNm)
        .setChargeId(this.chargeId)
        .setChargeEmail(this.chargeEmail)
        .setFrstCompAmtSum(this.frstCompAmtSum)
        .setSecdCompAmtSum(this.secdCompAmtSum)
        .setImplementerPhone(this.implementerPhone)
        .setCreatedTime(LocalDateTime.now());
  }
}
