package com.dantas2009.bookstore.auth.models;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Device {

  @Id
  @GeneratedValue
  public Integer id;

  @Column
  public String device_name;

  @Column
  public String device_os;

  @Column
  public String browser;

  @Column
  public String ip_address;

  @Nullable
  @Column
  public String latitude;

  @Nullable
  @Column
  public String longitude;

  @Column(columnDefinition = "boolean default false")
  public boolean revoked;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "idUser")
  public User user;
}