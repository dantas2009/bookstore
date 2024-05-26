package com.dantas2009.bookstore.auth.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dantas2009.bookstore.auth.models.AuthCode;

public interface AuthCodeRepository extends JpaRepository<AuthCode, Integer> {

  @Query(value = """
      select a from AuthCode a
      inner join a.user u
      inner join a.device d
      where d.id = a.device.id and
         u.id = a.user.id and
         a.code = :code and
         a.revoked = false and
         a.expired = false
      """)
  Optional<AuthCode> findByCode(String code);

  @Query(value = """
      select a from AuthCode a
      inner join a.user u
      inner join a.device d
      where d.id = a.device.id and
         u.id = a.user.id and
         a.user.id = :id and
         a.revoked = false and
         a.expired = false
      """)
  List<AuthCode> findAllValidAuthCodeByUser(Integer id);
}