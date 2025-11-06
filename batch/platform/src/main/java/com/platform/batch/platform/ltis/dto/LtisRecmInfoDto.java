package com.platform.batch.platform.ltis.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.platform.batch.platform.common.utils.LocalDateFromDateTimeDeserializer;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jooq.generated.tables.pojos.LtisRecmInfoEntity;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LtisRecmInfoDto {

  @JsonProperty("recmAdvcSeq")
  private Long recmAdvcSeq;
  @JsonProperty("judgSeq")
  private Long judgSeq;
  @JsonProperty("grpDivCd")
  private String grpDivCd;
  @JsonProperty("compCd")
  private String compCd;
  @JsonProperty("comyAbbv")
  private String comyAbbv;
  @JsonProperty("recmReqDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate recmReqDt;
  @JsonProperty("recmReqSbmtDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate recmReqSbmtDt;
  @JsonProperty("caseNo")
  private String caseNo;
  @JsonProperty("rwrdPrce")
  private Long rwrdPrce;
  @JsonProperty("recmAdvcRmk")
  private String recmAdvcRmk;
  @JsonProperty("prceDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate prceDt;
  @JsonProperty("prgsStatCd")
  private String prgsStatCd;
  @JsonProperty("apprPath")
  private String apprPath;
  @JsonProperty("apprInstInfo")
  private String apprInstInfo;
  @JsonProperty("reptModReqDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate reptModReqDt;
  @JsonProperty("comsPayYn")
  private String comsPayYn;
  @JsonProperty("ichrAppsLicsNo")
  private String ichrAppsLicsNo;
  @JsonProperty("apprEmail")
  private String apprEmail;
  @JsonProperty("apprNm")
  private String apprNm;
  @JsonProperty("apprOffcNm")
  private String apprOffcNm;
  @JsonProperty("apprOffcAddr")
  private String apprOffcAddr;
  @JsonProperty("apprDtlAddr")
  private String apprDtlAddr;
  @JsonProperty("apprOfcePhonNo")
  private String apprOfcePhonNo;
  @JsonProperty("apprPhonNo")
  private String apprPhonNo;
  @JsonProperty("apprOfceFaxNo")
  private String apprOfceFaxNo;
  @JsonProperty("recmReqPrceDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate recmReqPrceDt;
  @JsonProperty("modDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate modDt;

  public LtisRecmInfoEntity toEntity() {
    return new LtisRecmInfoEntity()
        .setRecmAdvcSeq(this.recmAdvcSeq)
        .setJudgSeq(this.judgSeq)
        .setGrpDivCd(this.grpDivCd)
        .setCompCd(this.compCd)
        .setComyAbbv(this.comyAbbv)
        .setRecmReqDt(this.recmReqDt)
        .setRecmReqSbmtDt(this.recmReqSbmtDt)
        .setCaseNo(this.caseNo)
        .setRwrdPrce(this.rwrdPrce)
        .setRecmAdvcRmk(this.recmAdvcRmk)
        .setPrceDt(this.prceDt)
        .setPrgsStatCd(this.prgsStatCd)
        .setApprPath(this.apprPath)
        .setApprInstInfo(this.apprInstInfo)
        .setReptModReqDt(this.reptModReqDt)
        .setComsPayYn(this.comsPayYn)
        .setIchrAppsLicsNo(this.ichrAppsLicsNo)
        .setApprEmail(this.apprEmail)
        .setApprNm(this.apprNm)
        .setApprOffcNm(this.apprOffcNm)
        .setApprOffcAddr(this.apprOffcAddr)
        .setApprDtlAddr(this.apprDtlAddr)
        .setApprOfcePhonNo(this.apprOfcePhonNo)
        .setApprPhonNo(this.apprPhonNo)
        .setApprOfceFaxno(this.apprOfceFaxNo)
        .setRecmReqPrceDt(this.recmReqPrceDt)
        .setModDt(this.modDt);
  }
}