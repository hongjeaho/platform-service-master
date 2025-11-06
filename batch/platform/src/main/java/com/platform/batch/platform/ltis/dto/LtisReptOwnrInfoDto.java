package com.platform.batch.platform.ltis.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.platform.batch.platform.common.utils.LocalDateFromDateTimeDeserializer;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jooq.generated.tables.pojos.LtisReptOwnrInfoEntity;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LtisReptOwnrInfoDto {

  @JsonProperty("reptOwnrIntrSeq")
  private Long reptOwnrIntrSeq;
  @JsonProperty("reptSeq")
  private Long reptSeq;
  @JsonProperty("judgSeq")
  private Long judgSeq;
  @JsonProperty("ownrIntrYn")
  private String ownrIntrYn;
  @JsonProperty("ownrSeq")
  private Long ownrSeq;
  @JsonProperty("intrSeq")
  private Long intrSeq;
  @JsonProperty("intrRightsNm")
  private String intrRightsNm;
  @JsonProperty("landShre")
  private String landShre;
  @JsonProperty("befAmt")
  private Long befAmt;
  @JsonProperty("frstCompAmt")
  private Long frstCompAmt;
  @JsonProperty("secdCompAmt")
  private Long secdCompAmt;
  @JsonProperty("thrdCompAmt")
  private Long thrdCompAmt;
  @JsonProperty("compAvrgAmt")
  private Long compAvrgAmt;
  @JsonProperty("judgAmt")
  private Long judgAmt;
  @JsonProperty("ownrRegtSeq")
  private Long ownrRegtSeq;
  @JsonProperty("intrRegtSeq")
  private Long intrRegtSeq;
  @JsonProperty("befReptOwnrIntrSeq")
  private String befReptOwnrIntrSeq;
  @JsonProperty("addChargeYn")
  private String addChargeYn;
  @JsonProperty("judgUnitCost")
  private Long judgUnitCost;
  @JsonProperty("omitYn")
  private String omitYn;
  @JsonProperty("judgCalcCd")
  private String judgCalcCd;
  @JsonProperty("reptOwnrIntrRmk")
  private String reptOwnrIntrRmk;
  @JsonProperty("modDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate modDt;

  public LtisReptOwnrInfoEntity toEntity() {
    return new LtisReptOwnrInfoEntity()
        .setReptOwnrIntrSeq(this.reptOwnrIntrSeq)
        .setReptSeq(this.reptSeq)
        .setJudgSeq(this.judgSeq)
        .setOwnrIntrYn(this.ownrIntrYn)
        .setOwnrSeq(this.ownrSeq)
        .setIntrSeq(this.intrSeq)
        .setIntrRightsNm(this.intrRightsNm)
        .setLandShre(this.landShre)
        .setBefAmt(this.befAmt)
        .setFrstCompAmt(this.frstCompAmt)
        .setSecdCompAmt(this.secdCompAmt)
        .setThrdCompAmt(this.thrdCompAmt)
        .setCompAvrgAmt(this.compAvrgAmt)
        .setJudgAmt(this.judgAmt)
        .setOwnrRegtSeq(this.ownrRegtSeq)
        .setIntrRegtSeq(this.intrRegtSeq)
        .setBefReptOwnrIntrSeq(this.befReptOwnrIntrSeq)
        .setAddChargeYn(this.addChargeYn)
        .setJudgUnitCost(this.judgUnitCost)
        .setOmitYn(this.omitYn)
        .setJudgCalcCd(this.judgCalcCd)
        .setReptOwnrIntrRmk(this.reptOwnrIntrRmk)
        .setModDt(this.modDt);
  }
}