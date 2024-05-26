package com.dantas2009.bookstore.auth.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dantas2009.bookstore.auth.models.Token;

public interface TokenRepository extends JpaRepository<Token, Integer> {

  @Query(value = """
      select t from Token t
      inner join t.user u
      where u.id = :id and (t.expired = false or t.revoked = false)
      """)
  List<Token> findAllValidAccessTokenByUser(Integer id);

  @Query("""
    select t from Token t 
    join fetch t.user 
    join fetch t.device 
    where t.accessToken = :token 
      and (t.expired = false or t.revoked = false)
    """)
  Optional<Token> findByAccessToken(String token);
}