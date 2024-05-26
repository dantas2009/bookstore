package com.dantas2009.bookstore.auth.queue.kafka.producer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class AuthProducer {

    @Value("${bookstore.kafka.topic.auth.code}")
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
