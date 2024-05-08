package com.dantas2009.bookstore.home;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dantas2009.bookstore.models.Home;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/")
public class HomeController {

    @GetMapping("")
    public ResponseEntity<Home> bookstore() {
        return ResponseEntity.ok(new Home("bookstore"));
    }
}
