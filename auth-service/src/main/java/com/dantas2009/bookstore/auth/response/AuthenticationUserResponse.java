package com.dantas2009.bookstore.auth.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationUserResponse {

  @JsonProperty("id_user")
  private int id_user;
  @JsonProperty("email")
  private String email;
}