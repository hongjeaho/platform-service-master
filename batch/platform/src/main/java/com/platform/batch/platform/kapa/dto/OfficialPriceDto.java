package com.platform.batch.platform.kapa.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jooq.generated.tables.pojos.KapaOfficialPriceEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OfficialPriceDto {

  @JsonProperty("CYEAR")
  private String cyear;

  @JsonProperty("REG")
  private String reg;

  @JsonProperty("EUB")
  private String eub;

  @JsonProperty("SAN")
  private String san;

  @JsonProperty("BUN1")
  private String bun1;

  @JsonProperty("BUN2")
  private String bun2;

  @JsonProperty("AS1")
  private String as1;

  @JsonProperty("EUBNAME")
  private String eubname;

  @JsonProperty("CJIBUN")
  private String cjibun;

  @JsonProperty("AREA")
  private BigDecimal area;

  @JsonProperty("GAKUKA")
  private Long gakuka;

  @JsonProperty("BIKYO")
  private Long bikyo;

  @JsonProperty("USEAREA")
  private String usearea;

  @JsonProperty("GIMOK")
  private String gimok;

  @JsonProperty("YOUNGDO")
  private String youngdo;

  @JsonProperty("GIYUK")
  private String giyuk;

  @JsonProperty("GOJEU")
  private String gojeu;

  @JsonProperty("HUNG")
  private String hung;

  @JsonProperty("BAN")
  private String ban;

  @JsonProperty("JUB")
  private String jub;

  @JsonProperty("GIMOKSTR")
  private String gimokstr;

  @JsonProperty("GIMOKSTR_S")
  private String gimokstrS;

  @JsonProperty("GIMOKSTR_P")
  private String gimokstrP;

  @JsonProperty("YOUNGDOSTR")
  private String youngdostr;

  @JsonProperty("YOUNGDOSTR_S")
  private String youngdostrS;

  @JsonProperty("YOUNGDOSTR_P")
  private String youngdostrP;

  @JsonProperty("GIYUKSTR")
  private String giyukstr;

  @JsonProperty("GIYUKSTR_S")
  private String giyukstrS;

  @JsonProperty("GIYUKSTR_P")
  private String giyukstrP;

  @JsonProperty("GOJEUSTR")
  private String gojeustr;

  @JsonProperty("GOJEUSTR_S")
  private String gojeustrS;

  @JsonProperty("GOJEUSTR_P")
  private String gojeustrP;

  @JsonProperty("HUNGSTR")
  private String hungstr;

  @JsonProperty("HUNGSTR_S")
  private String hungstrS;

  @JsonProperty("HUNGSTR_P")
  private String hungstrP;

  @JsonProperty("BANSTR")
  private String banstr;

  @JsonProperty("JUBSTR")
  private String jubstr;

  @JsonProperty("DX")
  private String dx;

  @JsonProperty("DY")
  private String dy;

  @JsonProperty("PNU")
  private String pnu;

  @JsonProperty("USE_YN")
  private String useYn;

  @JsonProperty("FASC")
  private BigDecimal fasc;

  @JsonProperty("FASCSTR")
  private String fascstr;

  @JsonProperty("FASCY")
  private String fascy;

  @JsonProperty("GIYUK2")
  private String giyuk2;

  @JsonProperty("GIYUK2STR")
  private String giyuk2str;

  @JsonProperty("GIYUK2STR_S")
  private String giyuk2strS;

  @JsonProperty("GIYUK2STR_P")
  private String giyuk2strP;

  @JsonProperty("Y1AREA")
  private String y1area;

  @JsonProperty("Y2AREA")
  private String y2area;

  public KapaOfficialPriceEntity toEntity() {
    return new KapaOfficialPriceEntity()
        .setCYear(this.cyear)
        .setReg(this.reg)
        .setEub(this.eub)
        .setSan(this.san)
        .setBun1(this.bun1)
        .setBun2(this.bun2)
        .setAs1(this.as1)
        .setEubName(this.eubname)
        .setJibun(this.cjibun)
        .setArea(this.area)
        .setGakuka(this.gakuka)
        .setStandardSeqNo(this.bikyo)
        .setGimok(this.gimok)
        .setYoungdo(this.youngdo)
        .setGiyuk(this.giyuk)
        .setGojeu(this.gojeu)
        .setHung(this.hung)
        .setBan(this.ban)
        .setJub(this.jub)
        .setGimokStr(this.gimokstr)
        .setYoungdoStr(this.youngdostr)
        .setGiyukStr(this.giyukstr)
        .setGojeuStr(this.gojeustr)
        .setHungStr(this.hungstr)
        .setBanStr(this.banstr)
        .setJubStr(this.jubstr)
        .setTmX(this.dx)
        .setTmY(this.dy)
        .setPnu(this.pnu)
        .setUseYn(this.useYn)
        .setFasc(this.fasc)
        .setFascStr(this.fascstr)
        .setFascy(this.fascy);
  }
}
