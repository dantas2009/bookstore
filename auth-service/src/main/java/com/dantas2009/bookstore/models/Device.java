package com.dantas2009.bookstore.models;

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

  public String device_name;

  public String device_os;

  public String browser;

  public String ip_address;

  @Nullable
  public String latitude;

  @Nullable
  public String longitude;

  @Column(columnDefinition = "boolean default false")
  public boolean revoked;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "idUser")
  public User user;
}