package com.dantas2009.bookstore.queue.kafka.producer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class SendAuthCode {
  private String code;
  private String email;
}
