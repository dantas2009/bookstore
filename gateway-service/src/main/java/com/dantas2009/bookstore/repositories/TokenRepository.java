package com.dantas2009.bookstore.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dantas2009.bookstore.models.Token;

public interface TokenRepository extends JpaRepository<Token, Integer> {
  @Query("""
    select t from Token t 
    join fetch t.user 
    join fetch t.device 
    where t.accessToken = :token 
      and (t.expired = false or t.revoked = false)
    """)
  Optional<Token> findByAccessToken(String token);
}