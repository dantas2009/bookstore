package com.dantas2009.bookstore.queue.kafka.producer;

import org.apache.kafka.common.KafkaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class AuthProducer {

    @Value("${kafka.topic.auth.code}")
    private String topicAuthCode;

    @Autowired
    private final KafkaTemplate<String, String> kafkaTemplate;

    public AuthProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendCode(final String key, final String authcode) {
        kafkaTemplate.send(topicAuthCode, key, authcode);
    }
}
