package com.dantas2009.bookstore.auth.models;

import java.util.Date;

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
public class AuthCode {

    @Id
    @GeneratedValue
    public Integer id;
  
    @Column
    public String code;
  
    @Column
    public Date expire_at;

    @Column(columnDefinition = "boolean default false")
    public boolean expired;

    @Column(columnDefinition = "boolean default false")
    public boolean revoked;
  
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    public User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_device")
    public Device device;
}
