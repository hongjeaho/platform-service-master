package com.platform.batch.platform.kapa.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jooq.generated.tables.pojos.KapaStandardPriceEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class StandardPriceDto {

  @JsonProperty("NO")
  private Long no;

  @JsonProperty("CYEAR")
  private String cYear;

  @JsonProperty("PNU")
  private String sPnu;

  @JsonProperty("SREG")
  private String sReg;

  @JsonProperty("SEUB")
  private String sEub;

  @JsonProperty("SSAN")
  private String sSan;

  @JsonProperty("SBUN1")
  private String sBun1;

  @JsonProperty("SBUN2")
  private String sBun2;

  @JsonProperty("EUBNAME")
  private String eubName;

  @JsonProperty("CJIBUN")
  private String jibun;

  @JsonProperty("GIMOK1")
  private String gimok1;

  @JsonProperty("GIMOK1STR")
  private String gimok1Str;

  @JsonProperty("GIMOK2")
  private String gimok2;

  @JsonProperty("GIMOK2STR")
  private String gimok2Str;

  @JsonProperty("GIYUK1")
  private String giyuk1;

  @JsonProperty("GIYUK1STR")
  private String giyuk1Str;

  @JsonProperty("YOUNGDO1")
  private String youngdo1;

  @JsonProperty("YOUNGDO1STR")
  private String youngdo1Str;

  @JsonProperty("YOUNGDO2")
  private String youngdo2;

  @JsonProperty("AREA")
  private String area;

  @JsonProperty("GOJEU")
  private String gojeu;

  @JsonProperty("GOJEUSTR")
  private String gojeuStr;

  @JsonProperty("HUNG")
  private String hung;

  @JsonProperty("HUNGSTR")
  private String hungStr;

  @JsonProperty("BAN")
  private String ban;

  @JsonProperty("BANSTR")
  private String banStr;

  @JsonProperty("JUB")
  private String jub;

  @JsonProperty("JUBSTR")
  private String jubStr;

  @JsonProperty("FASC")
  private String fasc;

  @JsonProperty("FASCSTR")
  private String fascStr;

  @JsonProperty("GAKUKC")
  private String gakukc;

  @JsonProperty("GAKUK1")
  private String gakuk1;

  @JsonProperty("GAKUK2")
  private String gakuk2;

  @JsonProperty("GAKUK3")
  private String gakuk3;

  @JsonProperty("GAKUK4")
  private String gakuk4;

  @JsonProperty("DX")
  private String dx;

  @JsonProperty("DY")
  private String dy;

  @JsonProperty("USE_YN")
  private String useYn;

  public KapaStandardPriceEntity toEntity() {
    return new KapaStandardPriceEntity()
        .setSeqNo(this.no)
        .setSPnu(this.sPnu)
        .setCYear(this.cYear)
        .setSReg(this.sReg)
        .setSEub(this.sEub)
        .setSSan(this.sSan)
        .setSBun1(this.sBun1)
        .setSBun2(this.sBun2)
        .setEubName(this.eubName)
        .setJibun(this.jibun)
        .setGimok1(this.gimok1)
        .setGimok1Str(this.gimok1Str)
        .setGimok2(this.gimok2)
        .setGimok2Str(this.gimok2Str)
        .setGiyuk1(this.giyuk1)
        .setGiyuk1Str(this.giyuk1Str)
        .setYoungdo1(this.youngdo1)
        .setYoungdo1Str(this.youngdo1Str)
        .setYoungdo2(this.youngdo2)
        .setArea(this.area)
        .setGojeu(this.gojeu)
        .setGojeuStr(this.gojeuStr)
        .setHung(this.hung)
        .setHungStr(this.hungStr)
        .setBan(this.ban)
        .setBanStr(this.banStr)
        .setJub(this.jub)
        .setJubStr(this.jubStr)
        .setFasc(this.fasc)
        .setFascStr(this.fascStr)
        .setGakukc(this.gakukc)
        .setGakuk1(this.gakuk1)
        .setGakuk2(this.gakuk2)
        .setGakuk3(this.gakuk3)
        .setGakuk4(this.gakuk4)
        .setTmX(this.dx)
        .setTmY(this.dy)
        .setUseYn(this.useYn);
  }
}
