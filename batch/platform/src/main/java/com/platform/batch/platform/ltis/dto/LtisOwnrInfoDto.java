package com.platform.batch.platform.ltis.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.platform.batch.platform.common.utils.LocalDateFromDateTimeDeserializer;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jooq.generated.tables.pojos.LtisOwnrInfoEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LtisOwnrInfoDto {

  @JsonProperty("ownrSeq")
  private Long ownrSeq;
  @JsonProperty("judgSeq")
  private Long judgSeq;
  @JsonProperty("ownrIntrNm")
  private String ownrIntrNm;
  @JsonProperty("ownrIntrYn")
  private String ownrIntrYn;
  @JsonProperty("delvZipNo")
  private String delvZipNo;
  @JsonProperty("delvDtlAddr1")
  private String delvDtlAddr1;
  @JsonProperty("delvDtlAddr2")
  private String delvDtlAddr2;
  @JsonProperty("depyZipNo")
  private String depyZipNo;
  @JsonProperty("depyDtlAddr1")
  private String depyDtlAddr1;
  @JsonProperty("depyDtlAddr2")
  private String depyDtlAddr2;
  @JsonProperty("regtNo")
  private String regtNo;
  @JsonProperty("ownrIntrRmk")
  private String ownrIntrRmk;
  @JsonProperty("regtYear")
  private String regtYear;
  @JsonProperty("befOwnrIntrSeq")
  private String befOwnrIntrSeq;
  @JsonProperty("representYn")
  private String representYn;
  @JsonProperty("agreeYn")
  private String agreeYn;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  @JsonProperty("addDt1")
  private LocalDate addDt1;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  @JsonProperty("addDt2")
  private LocalDate addDt2;
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  @JsonProperty("addDt3")
  private LocalDate addDt3;
  @JsonProperty("ownrIntrNmSeq")
  private Long ownrIntrNmSeq;
  @JsonProperty("modDt")
  @JsonDeserialize(using = LocalDateFromDateTimeDeserializer.class)
  private LocalDate modDt;

  public LtisOwnrInfoEntity toEntity() {
    return new LtisOwnrInfoEntity()
        .setOwnrSeq(this.ownrSeq)
        .setJudgSeq(this.judgSeq)
        .setOwnrIntrNm(this.ownrIntrNm)
        .setOwnrIntrYn(this.ownrIntrYn)
        .setDelvZipNo(this.delvZipNo)
        .setDelvDtlAddr1(this.delvDtlAddr1)
        .setDelvDtlAddr2(this.delvDtlAddr2)
        .setDepyZipNo(this.depyZipNo)
        .setDepyDtlAddr1(this.depyDtlAddr1)
        .setDepyDtlAddr2(this.depyDtlAddr2)
        .setRegtNo(this.regtNo)
        .setOwnrIntrRmk(this.ownrIntrRmk)
        .setRegtYear(this.regtYear)
        .setBefOwnrIntrSeq(this.befOwnrIntrSeq)
        .setRepresentYn(this.representYn)
        .setAgreeYn(this.agreeYn)
        .setAddDt1(this.addDt1)
        .setAddDt2(this.addDt2)
        .setAddDt3(this.addDt3)
        .setOwnrIntrNmSeq(this.ownrIntrNmSeq)
        .setModDt(this.modDt);
  }
}
