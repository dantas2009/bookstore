package com.dantas2009.bookstore.auth.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tokens")
public class Token {

  @Id
  @GeneratedValue
  public Integer id;

  @Column(name = "access_token", unique = true)
  public String accessToken;

  @Column
  public boolean expired;

  @Column
  public boolean revoked;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_user")
  public User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_device")
  public Device device;
}