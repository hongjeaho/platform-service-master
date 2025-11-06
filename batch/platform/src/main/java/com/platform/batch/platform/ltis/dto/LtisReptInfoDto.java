package com.platform.batch.platform.ltis.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.platform.batch.platform.common.utils.LocalDateFromDateTimeDeserializer;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jooq.generated.tables.pojos.LtisReptInfoEntity;


@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LtisReptInfoDto {

  @JsonProperty("reptSeq")
  private Long reptSeq;
  @JsonProperty("judgSeq")
  private Long judgSeq;
  @JsonProperty("reptLstSeq")
  private Long reptLstSeq;
  @JsonProperty("sidoGunguCd")
  private String sidoGunguCd;
  @JsonProperty("domyriCd")
  private String domyriCd;
  @JsonProperty("montDivCd")
  private String montDivCd;
  @JsonProperty("mainStrtNo")
  private String mainStrtNo;
  @JsonProperty("subStrtNo")
  private String subStrtNo;
  @JsonProperty("strtOther")
  private String strtOther;
  @JsonProperty("reptAddr")
  private String reptAddr;
  @JsonProperty("areaAmot")
  private BigDecimal areaAmot;
  @JsonProperty("obstKindNm")
  private String obstKindNm;
  @JsonProperty("obstStuc1Nm")
  private String obstStuc1Nm;
  @JsonProperty("obstStuc2Nm")
  private String obstStuc2Nm;
  @JsonProperty("befCalcCd")
  private String befCalcCd;
  @JsonProperty("frstCompCalcCd")
  private String frstCompCalcCd;
  @JsonProperty("secdCompCalcCd")
  private String secdCompCalcCd;
  @JsonProperty("thrdCompCalcCd")
  private String thrdCompCalcCd;
  @JsonProperty("compAvrgCalcCd")
  private String compAvrgCalcCd;
  @JsonProperty("judgCalcCd")
  private String judgCalcCd;
  @JsonProperty("befUnitCost")
  private Long befUnitCost;
  @JsonProperty("frstCompUnitCost")
  private Long frstCompUnitCost;
  @JsonProperty("secdCompUnitCost")
  private Long secdCompUnitCost;
  @JsonProperty("thrdCompUnitCost")
  private Long thrdCompUnitCost;
  @JsonProperty("compAvrgUnitCost")
  private Long compAvrgUnitCost;
  @JsonProperty("judgUnitCost")
  private Long judgUnitCost;
  @JsonProperty("rightsNm")
  private String rightsNm;
  @JsonProperty("sfceRightsyn")
  private String sfceRightsYn;
  @JsonProperty("landObstKindCd")
  private String landObstKindCd;
  @JsonProperty("reptLstBefSeq")
  private Long reptLstBefSeq;
  @JsonProperty("areaUnit")
  private String areaUnit;
  @JsonProperty("obstStuc1Cd")
  private String obstStuc1Cd;
  @JsonProperty("obstStuc2Cd")
  private String obstStuc2Cd;
  @JsonProperty("omitYn")
  private String omitYn;
  @JsonProperty("modDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate modDt;

  public LtisReptInfoEntity toEntity() {
    return new LtisReptInfoEntity()
        .setReptSeq(this.reptSeq)
        .setJudgSeq(this.judgSeq)
        .setReptLstSeq(this.reptLstSeq)
        .setSidoGunguCd(this.sidoGunguCd)
        .setDomyriCd(this.domyriCd)
        .setMontDivCd(this.montDivCd)
        .setMainStrtNo(this.mainStrtNo)
        .setSubStrtNo(this.subStrtNo)
        .setStrtOther(this.strtOther)
        .setReptAddr(this.reptAddr)
        .setAreaAmot(this.areaAmot)
        .setObstKindNm(this.obstKindNm)
        .setObstStuc1Nm(this.obstStuc1Nm)
        .setObstStuc2Nm(this.obstStuc2Nm)
        .setBefCalcCd(this.befCalcCd)
        .setFrstCompCalcCd(this.frstCompCalcCd)
        .setSecdCompCalcCd(this.secdCompCalcCd)
        .setThrdCompCalcCd(this.thrdCompCalcCd)
        .setCompAvrgCalcCd(this.compAvrgCalcCd)
        .setJudgCalcCd(this.judgCalcCd)
        .setBefUnitCost(this.befUnitCost)
        .setFrstCompUnitCost(this.frstCompUnitCost)
        .setSecdCompUnitCost(this.secdCompUnitCost)
        .setThrdCompUnitCost(this.thrdCompUnitCost)
        .setCompAvrgUnitCost(this.compAvrgUnitCost)
        .setJudgUnitCost(this.judgUnitCost)
        .setRightsNm(this.rightsNm)
        .setSfceRightsYn(this.sfceRightsYn)
        .setLandObstKindCd(this.landObstKindCd)
        .setReptLstBefSeq(this.reptLstBefSeq)
        .setAreaUnit(this.areaUnit)
        .setObstStuc1Cd(this.obstStuc1Cd)
        .setObstStuc2Cd(this.obstStuc2Cd)
        .setOmitYn(this.omitYn)
        .setModDt(this.modDt);
  }
}
