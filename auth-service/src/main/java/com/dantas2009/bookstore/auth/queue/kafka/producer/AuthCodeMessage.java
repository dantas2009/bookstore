package com.dantas2009.bookstore.auth.queue.kafka.producer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class AuthCodeMessage {
  private String code;
  private String email;

  @Override
  public String toString() {
    try {
      return new ObjectMapper().writeValueAsString(this);
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return super.toString();
    }
  }
}
