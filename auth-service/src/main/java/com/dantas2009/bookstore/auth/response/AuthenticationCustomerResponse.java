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
public class AuthenticationCustomerResponse {

  @JsonProperty("id_customer")
  private Integer id_customer;
  @JsonProperty("email")
  private String email;
}